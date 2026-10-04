import React, { useState } from 'react';
import { speakSanskrit, stopSpeaking } from '../utils/speech';

function TranslationResult({ data }) {
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const [ttsError, setTtsError] = useState('');

  if (!data || !data.sanskrit) return null;

  const handleSpeak = (textToSpeak, id) => {
    setTtsError('');

    if (activeSpeakingId === id) {
      stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }

    setActiveSpeakingId(id);

    const started = speakSanskrit(textToSpeak, {
      onStart: () => setActiveSpeakingId(id),
      onEnd: () => setActiveSpeakingId(null),
      onError: (errMsg) => {
        setActiveSpeakingId(null);
        setTtsError(errMsg);
      }
    });

    if (!started && !ttsError) {
      setActiveSpeakingId(null);
    }
  };

  return (
    <div className="translation-card">
      {/* Verification Warning Banner if translation lost/changed key meaning */}
      {(data.warning || data.verified === false) && (
        <div className="translation-warning-banner">
          <span className="warning-icon">⚠️</span>
          <div className="warning-text">
            <strong>Translation needs review</strong>
            <p>{data.warning || 'The generated Sanskrit may not fully capture all nuances of your original sentence.'}</p>
          </div>
        </div>
      )}

      {/* 1. Primary Sanskrit Output Box with Full Sentence Listen Button */}
      <div className="sanskrit-primary-box">
        <div className="sanskrit-sentence-display">
          <span className="sanskrit-label">Sanskrit</span>
          <h3 className="sanskrit-text">{data.sanskrit}</h3>
        </div>

        <button
          type="button"
          className={`listen-button ${activeSpeakingId === 'main' ? 'speaking' : ''}`}
          onClick={() => handleSpeak(data.sanskrit, 'main')}
          title="Click to hear Sanskrit sentence pronunciation"
        >
          {activeSpeakingId === 'main' ? '🔊 Speaking...' : '🔊 Listen'}
        </button>
      </div>

      {/* TTS Warning Banner if browser TTS is unavailable */}
      {ttsError && (
        <div className="tts-warning-banner">
          ⚠️ {ttsError}
        </div>
      )}

      {/* 2. Structured Word Meanings Breakdown */}
      {data.words && data.words.length > 0 && (
        <div className="translation-block">
          <div className="block-title">Word meanings</div>
          <div className="word-cards-grid">
            {data.words.map((item, index) => {
              const wordText = item.word || item.sanskrit;
              const hasMeaning = item.meaning && item.meaning !== '—';
              const displayMeaning = hasMeaning ? item.meaning : 'Detailed analysis unavailable for this word.';

              return (
                <div key={index} className="word-card-item">
                  <div className="word-card-header">
                    <span className="word-sanskrit">{wordText}</span>
                    <button
                      type="button"
                      className={`mini-listen-btn ${activeSpeakingId === `word-${index}` ? 'speaking' : ''}`}
                      onClick={() => handleSpeak(wordText, `word-${index}`)}
                      title={`Listen to ${wordText}`}
                    >
                      {activeSpeakingId === `word-${index}` ? '🔊' : '🔊'}
                    </button>
                  </div>

                  {item.transliteration && (
                    <div className="word-transliteration"><em>{item.transliteration}</em></div>
                  )}

                  <div className="word-meaning-text">{displayMeaning}</div>

                  {item.grammar && (
                    <div className="word-grammar-badge">{item.grammar}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Combined Meaning (Derived from Sanskrit, never copied from original English) */}
      {data.combined_meaning && (
        <div className="translation-block">
          <div className="block-title">Combined meaning</div>
          <div className="combined-meaning-box">
            "{data.combined_meaning}"
          </div>
        </div>
      )}

      {/* 4. Back Translation (if available) */}
      {data.back_translation && data.back_translation !== data.combined_meaning && (
        <div className="translation-block">
          <div className="block-title">Literal Back-Translation</div>
          <div className="back-translation-box">
            "{data.back_translation}"
          </div>
        </div>
      )}

      {/* 5. Grammar / Explanation */}
      {data.explanation && (
        <div className="translation-block explanation-block">
          <div className="block-title">Grammar Explanation</div>
          <p className="explanation-content">{data.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default TranslationResult;
