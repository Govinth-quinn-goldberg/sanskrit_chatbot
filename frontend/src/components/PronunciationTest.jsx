import React, { useState } from 'react';
import { isSpeechSupported, startListening } from '../utils/speech';
import { recordPronunciation } from '../utils/storage';

const PRONUNCIATION_PRACTICE_ITEMS = [
  { sanskrit: "नमस्ते", transliteration: "Namaste", meaning: "Greetings / Hello" },
  { sanskrit: "सुप्रभातम्", transliteration: "Suprabhātam", meaning: "Good morning" },
  { sanskrit: "धन्यवादः", transliteration: "Dhanyavādaḥ", meaning: "Thank you" },
  { sanskrit: "अहम् पठामि", transliteration: "Aham paṭhāmi", meaning: "I read" },
  { sanskrit: "रामः पुस्तकं पठति", transliteration: "Rāmaḥ pustakaṁ paṭhati", meaning: "Rama reads the book" },
  { sanskrit: "शुभरात्रिः", transliteration: "Śubharātriḥ", meaning: "Good night" },
];

function PronunciationTest({ onProgressChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const item = PRONUNCIATION_PRACTICE_ITEMS[currentIndex];

  const handleStartPractice = () => {
    if (!isSpeechSupported()) {
      setErrorMsg("Sanskrit speech recognition is unavailable. Pronunciation cannot be reliably evaluated with the current browser.");
      return;
    }

    setIsListening(true);
    setRecognizedText('');
    setResult(null);
    setErrorMsg('');

    startListening({
      lang: 'sa-IN',
      isSanskrit: true,
      onResult: (transcript) => {
        setRecognizedText(transcript);
        evaluatePronunciation(transcript);
      },
      onError: (err) => {
        setErrorMsg(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const evaluatePronunciation = (spoken) => {
    const target = item.sanskrit.toLowerCase().replace(/[\s\.\।]/g, '');
    const cleanSpoken = spoken.toLowerCase().replace(/[\s\.\।]/g, '');

    // Strict string match or Devanagari prefix match
    const isCloseMatch =
      cleanSpoken === target ||
      cleanSpoken.includes(target) ||
      target.includes(cleanSpoken);

    let evaluation = {};
    if (isCloseMatch) {
      evaluation = {
        isSuccess: true,
        message: "Your pronunciation appears close to the target!",
        sub: "Great job! Keep practicing spoken Sanskrit sounds."
      };
    } else {
      evaluation = {
        isSuccess: false,
        message: "Your pronunciation may need practice.",
        sub: "Try reciting the Sanskrit word again clearly near your microphone."
      };
    }

    setResult(evaluation);
    const updated = recordPronunciation(evaluation.isSuccess);
    if (onProgressChange) onProgressChange(updated);
  };

  const handleNext = () => {
    setRecognizedText('');
    setResult(null);
    setErrorMsg('');
    setCurrentIndex((prev) => (prev + 1) % PRONUNCIATION_PRACTICE_ITEMS.length);
  };

  return (
    <div className="tab-pane single-column">
      <div className="section-header">
        <h2>Basic Pronunciation Check</h2>
        <p>Practice speaking Sanskrit words and check spoken text alignment.</p>
        <div className="disclaimer-badge">
          ℹ️ Basic pronunciation check based on speech recognition. This check uses speech recognition and compares the recognized text with the target. It is not a professional acoustic pronunciation assessment.
        </div>
      </div>

      <div className="pronounce-card">
        <div className="sanskrit-display">{item.sanskrit}</div>
        <div className="translit-display">{item.transliteration}</div>
        <div className="meaning-display">Meaning: "{item.meaning}"</div>

        <div className="mic-action-box">
          <button
            className={`btn-record ${isListening ? 'recording' : ''}`}
            onClick={handleStartPractice}
            disabled={isListening}
          >
            {isListening ? '🎙️ Listening... Speak Sanskrit Now!' : '🎤 Click & Pronounce Word'}
          </button>
        </div>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        {recognizedText && (
          <div className="spoken-result-box">
            <strong>Recognized Speech:</strong> "{recognizedText}"
          </div>
        )}

        {result && (
          <div className={`pronounce-result ${result.isSuccess ? 'success' : 'warn'}`}>
            <h4>{result.message}</h4>
            <p>{result.sub}</p>
          </div>
        )}

        <button className="btn-action secondary wide mt-1" onClick={handleNext}>
          Next Word / Sentence →
        </button>
      </div>
    </div>
  );
}

export default PronunciationTest;
