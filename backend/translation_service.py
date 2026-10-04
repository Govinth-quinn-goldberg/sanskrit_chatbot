import os
import sys
import time
import logging
import types
import re
import json
import requests
import torch
import transformers

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("translation_service")

# Compatibility monkey-patches for IndicTransTokenizer & transformers 5.x+
if not hasattr(transformers.tokenization_utils, 'PreTrainedTokenizerBase'):
    transformers.tokenization_utils.PreTrainedTokenizerBase = transformers.PreTrainedTokenizerBase

transformers.PreTrainedTokenizer.verbose = True
transformers.PreTrainedTokenizer._special_tokens_map = {}

onnx_mod = types.ModuleType('transformers.onnx')
onnx_mod.OnnxConfig = object
onnx_mod.OnnxSeq2SeqConfigWithPast = object

onnx_utils = types.ModuleType('transformers.onnx.utils')
onnx_utils.compute_effective_axis_dimension = lambda *args, **kwargs: None

sys.modules['transformers.onnx'] = onnx_mod
sys.modules['transformers.onnx.utils'] = onnx_utils

# Patch _tie_or_clone_weights if missing in newer transformers
if not hasattr(transformers.PreTrainedModel, '_tie_or_clone_weights'):
    def _tie_or_clone_weights(self, output_embeddings, input_embeddings):
        output_embeddings.weight = input_embeddings.weight
    transformers.PreTrainedModel._tie_or_clone_weights = _tie_or_clone_weights

# Patch dynamic module class loading for tie_weights compatibility
import transformers.dynamic_module_utils as dynamic_utils

orig_get_class = dynamic_utils.get_class_from_dynamic_module

def patched_get_class(*args, **kwargs):
    cls = orig_get_class(*args, **kwargs)
    if hasattr(cls, 'tie_weights'):
        orig_tw = cls.tie_weights
        def tw_wrapper(self, *w_args, **w_kwargs):
            try:
                return orig_tw(self, *w_args, **w_kwargs)
            except TypeError:
                return orig_tw(self)
        cls.tie_weights = tw_wrapper
    return cls

dynamic_utils.get_class_from_dynamic_module = patched_get_class

from transformers import AutoModelForSeq2SeqLM
from huggingface_hub import hf_hub_download
import importlib.util
from IndicTransToolkit import IndicProcessor

class TranslationService:
    """
    Modular Translation Service using AI4Bharat IndicTrans2 distilled 200M model for NMT
    and Llama 3.2 3B via Ollama for word-by-word breakdown and grammar explanation.
    """

    def __init__(self):
        self.model_repo = "naklitechie/indictrans2-en-indic-dist-200M"
        self.model = None
        self.tokenizer = None
        self.ip = None
        self.loaded = False
        self.load_error = None
        self.load_time_seconds = None
        self.device = "cpu"
        self.src_lang = "eng_Latn"
        self.tgt_lang = "san_Deva"

    def load_model(self):
        """Loads IndicTrans2 200M model once at application startup on CPU."""
        if self.loaded:
            logger.info("IndicTrans2 model is already loaded.")
            return

        logger.info(f"Loading IndicTrans2 200M distilled model ({self.model_repo}) on CPU...")
        start_time = time.time()
        try:
            # 1. Download model & tokenizer assets from Hugging Face Hub
            src_vocab = hf_hub_download(self.model_repo, 'dict.SRC.json')
            tgt_vocab = hf_hub_download(self.model_repo, 'dict.TGT.json')
            src_spm = hf_hub_download(self.model_repo, 'model.SRC')
            tgt_spm = hf_hub_download(self.model_repo, 'model.TGT')
            tok_script = hf_hub_download(self.model_repo, 'tokenization_indictrans.py')

            # 2. Dynamically import IndicTransTokenizer
            spec = importlib.util.spec_from_file_location('tokenization_indictrans', tok_script)
            tok_mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(tok_mod)

            tok_mod.IndicTransTokenizer.unk_token = '<unk>'
            tok_mod.IndicTransTokenizer.pad_token = '<pad>'
            tok_mod.IndicTransTokenizer.eos_token = '</s>'
            tok_mod.IndicTransTokenizer.bos_token = '<s>'

            self.tokenizer = tok_mod.IndicTransTokenizer(
                src_vocab_fp=src_vocab,
                tgt_vocab_fp=tgt_vocab,
                src_spm_fp=src_spm,
                tgt_spm_fp=tgt_spm
            )

            # 3. Load Seq2Seq Model (CPU float32)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(
                self.model_repo,
                trust_remote_code=True,
                torch_dtype=torch.float32
            )
            self.model.eval()

            # 4. Initialize IndicProcessor
            self.ip = IndicProcessor(inference=True)

            self.load_time_seconds = round(time.time() - start_time, 2)
            self.loaded = True
            logger.info(f"IndicTrans2 200M model successfully loaded in {self.load_time_seconds}s on CPU.")
        except Exception as e:
            self.loaded = False
            self.load_error = str(e)
            logger.error(f"Failed to load IndicTrans2 model: {e}", exc_info=True)

    def is_translation_request(self, query: str) -> bool:
        """Determines if a user message is a translation request or sentence to translate."""
        q = query.lower().strip()

        # General grammar/concept questions are teaching questions, NOT translation requests!
        explanation_indicators = [
            r"^what is (a|an|the|\w+)?\s*(noun|verb|adjective|pronoun|case|vibhakti|sandhi|grammar|word|sentence|rule)",
            r"^explain",
            r"^why ",
            r"^how does",
            r"^tell me about",
            r"^give me an example of"
        ]
        if any(re.search(p, q) for p in explanation_indicators):
            return False

        translation_patterns = [
            r"^translate",
            r"how (do i|to|can i) say",
            r"how do you say",
            r"how to write",
            r"sanskrit translation",
            r"translate .* into sanskrit",
            r"what is the sanskrit (word|translation) for",
            r"give me the sanskrit for"
        ]
        if any(re.search(p, q) for p in translation_patterns):
            return True

        # Plain declarative English sentences (e.g. "I am learning Sanskrit.", "Rama reads the book.")
        if not q.endswith("?") and re.search(r"[a-zA-Z]", q):
            return True

        return False

    def extract_target_text(self, query: str) -> str:
        """Extracts the core phrase to translate from a user query."""
        text = query.strip()
        prefixes = [
            r"^how to say\s+",
            r"^how do i say\s+",
            r"^how do you say\s+",
            r"^translate[:\s]+",
            r"^give me the sanskrit for\s+",
            r"^what is the sanskrit for\s+",
            r"\s+in sanskrit\??$"
        ]
        clean_text = text
        for p in prefixes:
            clean_text = re.sub(p, "", clean_text, flags=re.IGNORECASE).strip()

        clean_text = clean_text.strip('"?\' .')
        return clean_text if clean_text else text

    def analyze_translation(self, sanskrit_text: str, english_text: str) -> dict:
        actual_sanskrit = sanskrit_text.strip()
        clean_english = english_text.strip()

        ollama_url = os.getenv(
            "OLLAMA_URL",
            "http://localhost:11434/api/generate"
        )
        model_name = os.getenv(
            "MODEL_NAME",
            "llama3.2:3b"
        )

        prompt = f"""
You are a Sanskrit language teacher.

Sanskrit:
{actual_sanskrit}

Original English:
{clean_english}

Analyze the Sanskrit sentence.

Return ONLY valid JSON:

{{
  "back_translation": "English meaning of the Sanskrit",
  "verified": true,
  "combined_meaning": "clear English meaning",
  "explanation": "short grammar/meaning explanation"
}}
"""

        logger.info("Starting Llama analysis for: %s", actual_sanskrit)

        start_time = time.time()

        try:
            response = requests.post(
                ollama_url,
                json={
                    "model": model_name,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "num_predict": 150
                    }
                },
                timeout=30
            )

            elapsed = time.time() - start_time

            logger.info(
                "Llama analysis completed in %.2fs",
                elapsed
            )

            if response.status_code != 200:
                logger.error(
                    "Ollama API failed: %s %s",
                    response.status_code,
                    response.text
                )

                return {
                    "back_translation": "",
                    "verified": False,
                    "combined_meaning": "Analysis unavailable",
                    "explanation": "Llama API request failed.",
                    "words": []
                }

            raw_response = response.json().get("response", "").strip()

            logger.info(
                "Raw Llama response: %s",
                raw_response
            )

            clean_json = (
                raw_response
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

            try:
                parsed = json.loads(clean_json)

                return {
                    "back_translation": str(
                        parsed.get("back_translation", "")
                    ).strip(),
                    "verified": bool(
                        parsed.get("verified", False)
                    ),
                    "combined_meaning": str(
                        parsed.get("combined_meaning", "")
                    ).strip(),
                    "explanation": str(
                        parsed.get("explanation", "")
                    ).strip(),
                    "words": []
                }

            except json.JSONDecodeError:
                logger.error(
                    "Llama returned invalid JSON: %s",
                    raw_response
                )

                return {
                    "back_translation": "",
                    "verified": False,
                    "combined_meaning": "Analysis unavailable",
                    "explanation": "Llama returned an invalid response.",
                    "words": []
                }

        except Exception:
            logger.exception(
                "Complete exception during Llama analysis for: %s",
                actual_sanskrit
            )

            return {
                "back_translation": "",
                "verified": False,
                "combined_meaning": "Analysis unavailable",
                "explanation": "Llama analysis failed.",
                "words": []
            }

    def translate(self, user_query: str) -> dict:
        """
        Main translation entry point using IndicTrans2 200M for NMT + Llama for word breakdown and back-translation verification.
        Returns structured dictionary response.
        """
        target_text = self.extract_target_text(user_query)

        if not self.loaded:
            logger.warning("Translation requested but IndicTrans2 model is not loaded.")
            return {
                "type": "translation_error",
                "sanskrit": "Translation model unavailable.",
                "words": [],
                "combined_meaning": target_text,
                "explanation": f"IndicTrans2 model failed to load on startup ({self.load_error or 'Not initialized'}). Normal tutoring chat remains available.",
                "reply": f"Sanskrit:\nTranslation model unavailable.\n\nMeaning:\n{target_text}\n\nExplanation:\nIndicTrans2 model failed to load on startup."
            }

        try:
            t0 = time.time()
            batch = self.ip.preprocess_batch([target_text], src_lang=self.src_lang, tgt_lang=self.tgt_lang)
            inputs = self.tokenizer(
                batch,
                src_lang=self.src_lang,
                truncation=True,
                padding="longest",
                return_tensors="pt"
            )

            with torch.inference_mode():
                outputs = self.model.generate(
                    **inputs,
                    num_beams=5,
                    max_length=256,
                    use_cache=False
                )

            decoded = self.tokenizer.batch_decode(outputs, skip_special_tokens=True)
            translated_sanskrit = self.ip.postprocess_batch(decoded, lang=self.tgt_lang)[0]
            elapsed = time.time() - t0
            logger.info(f"IndicTrans2 translated '{target_text}' -> '{translated_sanskrit}' in {elapsed:.2f}s")

            # Perform back-translation verification, word breakdown, and grammar analysis using Llama 3.2 3B
            analysis = self.analyze_translation(translated_sanskrit, target_text)

            # Build formatted string reply for backward compatibility
            word_lines = []
            for w in analysis.get("words", []):
                w_name = w.get("word") or w.get("sanskrit")
                w_mean = w.get("meaning", "")
                w_gram = w.get("grammar", "")
                if w_gram and w_gram != "Detailed analysis unavailable for this word.":
                    word_lines.append(f"{w_name} → {w_mean} ({w_gram})")
                else:
                    word_lines.append(f"{w_name} → {w_mean}")

            word_section = f"\n\nWord Meanings:\n" + "\n".join(word_lines) if word_lines else ""
            warning_section = f"{analysis.get('warning')}\n\n" if analysis.get("warning") else ""
            
            reply_text = (
                f"{warning_section}"
                f"Sanskrit:\n{translated_sanskrit}\n\n"
                f"Combined Meaning:\n{analysis.get('combined_meaning', target_text)}"
                f"{word_section}\n\n"
                f"Explanation:\n{analysis.get('explanation', '')}"
            )

            return {
                "type": "translation",
                "sanskrit": translated_sanskrit,
                "words": analysis.get("words", []),
                "combined_meaning": analysis.get("combined_meaning", target_text),
                "back_translation": analysis.get("back_translation", ""),
                "verified": analysis.get("verified", True),
                "warning": analysis.get("warning", None),
                "explanation": analysis.get("explanation", "Model-generated IndicTrans2 translation (English -> Sanskrit)."),
                "reply": reply_text
            }

        except Exception as e:
            logger.error(f"Error during translation inference: {e}", exc_info=True)
            return {
                "type": "translation_error",
                "sanskrit": "Translation processing error.",
                "words": [],
                "combined_meaning": target_text,
                "explanation": f"Failed to run IndicTrans2 model inference: {str(e)}",
                "reply": f"Sanskrit:\nTranslation processing error.\n\nMeaning:\n{target_text}\n\nExplanation:\nFailed to run IndicTrans2 model inference: {str(e)}"
            }

    def get_status(self) -> dict:
        """Returns model loading and hardware status."""
        return {
            "loaded": self.loaded,
            "model_name": self.model_repo,
            "device": self.device,
            "load_time_seconds": self.load_time_seconds,
            "error": self.load_error
        }

# Global singleton instance
translator_service = TranslationService()
