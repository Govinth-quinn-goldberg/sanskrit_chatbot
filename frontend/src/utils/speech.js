let activeRecognition = null;

export const isSpeechSupported = () => {
  return typeof window !== "undefined" &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
};

export const stopListening = () => {
  if (activeRecognition) {
    try {
      activeRecognition.abort();
    } catch (e) {}
    activeRecognition = null;
  }
};

export const startListening = ({
  onResult,
  onError,
  onEnd,
  onStart,
  lang = "sa-IN",
  isSanskrit = true
}) => {
  if (!isSpeechSupported()) {
    if (onError) {
      onError(
        isSanskrit
          ? "Sanskrit speech recognition is not available in this browser. Please type your answer."
          : "Speech recognition is unavailable in this browser. Please use text input."
      );
    }
    return null;
  }

  stopListening();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  activeRecognition = recognition;

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0][0].transcript;
      if (onResult && transcript) {
        onResult(transcript);
      }
    }
  };

  recognition.onerror = (event) => {
    const errType = event.error || "unknown";
    console.warn("Speech recognition event error:", errType);

    if (errType === "no-speech" || errType === "aborted") {
      return;
    }

    if ((errType === "language-not-supported" || errType === "network") && lang === "sa-IN" && isSanskrit) {
      console.log("Attempting Devanagari phonetic fallback (hi-IN)...");
      stopListening();
      startListening({
        onResult,
        onError: (fallbackErr) => {
          if (onError) {
            onError("Sanskrit speech recognition is not available in this browser. Please type your answer.");
          }
        },
        onEnd,
        onStart,
        lang: "hi-IN",
        isSanskrit: true
      });
      return;
    }

    let userMsg = isSanskrit
      ? "Sanskrit speech recognition is not available in this browser. Please type your answer."
      : "Speech recognition is unavailable in this browser. Please use text input.";

    if (errType === "not-allowed" || errType === "permission-denied") {
      userMsg = "Microphone access was denied. Please allow microphone permissions in browser settings.";
    }

    if (onError) {
      onError(userMsg);
    }
  };

  recognition.onend = () => {
    activeRecognition = null;
    if (onEnd) {
      onEnd();
    }
  };

  try {
    recognition.start();
  } catch (err) {
    console.warn("Failed to start speech recognition:", err);
    activeRecognition = null;
    if (onError) {
      onError(
        isSanskrit
          ? "Sanskrit speech recognition is not available in this browser. Please type your answer."
          : "Speech recognition is unavailable in this browser. Please use text input."
      );
    }
  }

  return recognition;
};

/* --- Text-to-Speech (TTS) Pronunciation Utilities --- */

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};

export const speakSanskrit = (text, { onStart, onEnd, onError } = {}) => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    if (onError) onError("Sanskrit voice is not available in your browser.");
    return false;
  }

  stopSpeaking();

  const voices = window.speechSynthesis.getVoices();

  // Search for Sanskrit (sa) or Hindi (hi) Indic voices
  let targetVoice = voices.find(
    (v) => v.lang && (v.lang.startsWith("sa") || v.lang.toLowerCase().includes("sanskrit"))
  );

  if (!targetVoice) {
    targetVoice = voices.find(
      (v) => v.lang && (v.lang.startsWith("hi") || v.lang.toLowerCase().includes("hindi"))
    );
  }

  // Strict check: If voices are loaded and no Indic voice exists, reject to avoid English pronunciation of Sanskrit
  if (!targetVoice && voices.length > 0) {
    const hasIndicVoice = voices.some(
      (v) =>
        v.lang &&
        (v.lang.startsWith("sa") ||
          v.lang.startsWith("hi") ||
          v.lang.startsWith("mr") ||
          v.lang.startsWith("ne"))
    );
    if (!hasIndicVoice) {
      if (onError) onError("Sanskrit voice is not available in your browser.");
      return false;
    }
  }

  const utterance = new SpeechSynthesisUtterance(text);
  if (targetVoice) {
    utterance.voice = targetVoice;
    utterance.lang = targetVoice.lang;
  } else {
    utterance.lang = "sa-IN";
  }

  utterance.rate = 0.85; // Slower rate for clear learner pronunciation

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn("Speech synthesis error event:", e);
    if (onError) onError("Sanskrit voice is not available in your browser.");
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("Failed to invoke speech synthesis:", err);
    if (onError) onError("Sanskrit voice is not available in your browser.");
    return false;
  }
};
