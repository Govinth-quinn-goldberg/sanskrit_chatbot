import React, { useState, useMemo } from 'react';
import { conversationTestsData } from '../data/conversationTests';
import { isSpeechSupported, startListening } from '../utils/speech';
import { recordConversationTest, getProgress } from '../utils/storage';

function ConversationTest({ onProgressChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const progress = getProgress();
  const completedList = progress.completedLessons || [];

  // Preferentially sort and select test questions matching completed lessons
  const availableTests = useMemo(() => {
    if (!completedList || completedList.length === 0) {
      return conversationTestsData;
    }
    const matched = conversationTestsData.filter((t) =>
      t.lessonId ? completedList.includes(t.lessonId) || completedList.includes(`beg-${t.lessonId}`) : true
    );
    return matched.length > 0 ? matched : conversationTestsData;
  }, [completedList]);

  const currentTest = availableTests[currentIndex % availableTests.length] || conversationTestsData[0];

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setEvalResult(null);

    try {
      const response = await fetch('http://localhost:8000/conversation-test/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentTest.prompt,
          user_answer: userAnswer.trim(),
          expected_answer: currentTest.expectedAnswer,
        }),
      });

      const data = await response.json();
      setEvalResult(data);

      const isPassed = data.status === 'correct' || data.status === 'partially_correct';
      const updated = recordConversationTest(isPassed);
      if (onProgressChange) onProgressChange(updated);
    } catch (err) {
      setEvalResult({
        status: 'incorrect',
        feedback: 'Could not connect to evaluation service.',
        expected_answer: currentTest.expectedAnswer,
        explanation: 'Backend or network error occurred.'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleMicClick = () => {
    if (!isSpeechSupported()) {
      setSpeechError("Sanskrit speech recognition is not available in this browser. Please type your answer.");
      return;
    }

    if (isListening) return;

    setIsListening(true);
    setSpeechError('');

    startListening({
      lang: 'sa-IN',
      isSanskrit: true,
      onResult: (transcript) => {
        setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      onError: (errMessage) => {
        setSpeechError(errMessage);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const handleNext = () => {
    setUserAnswer('');
    setEvalResult(null);
    setSpeechError('');
    if (currentIndex + 1 < availableTests.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="tab-pane single-column">
      <div className="section-header">
        <h2>Conversation Test</h2>
        <p>Test if you can apply what you learned in lessons! Type or speak your Sanskrit response.</p>
      </div>

      <div className="quiz-card">
        <div className="test-number">Test Question {currentIndex + 1} of {availableTests.length}</div>
        <h3 className="prompt-title">"{currentTest.prompt}"</h3>
        <p className="hint-text">💡 Hint: {currentTest.hint}</p>

        <form onSubmit={handleEvaluate} className="test-form">
          <div className="input-with-mic">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type or speak your Sanskrit answer..."
              disabled={isEvaluating || !!evalResult}
            />
            <button
              type="button"
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={handleMicClick}
              disabled={isEvaluating || !!evalResult}
              title={isListening ? 'Listening...' : 'Speak your answer'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          </div>

          {speechError && <div className="subtext-error">{speechError}</div>}

          {!evalResult && (
            <button
              type="submit"
              className="btn-action primary wide mt-1"
              disabled={isEvaluating || !userAnswer.trim()}
            >
              {isEvaluating ? 'Evaluating answer...' : 'Evaluate My Answer'}
            </button>
          )}
        </form>

        {evalResult && (
          <div className={`eval-box ${evalResult.status}`}>
            <h4>
              {evalResult.status === 'correct' && '✅ Correct! Perfect Sanskrit'}
              {evalResult.status === 'partially_correct' && '⚠️ Partially Correct'}
              {evalResult.status === 'incorrect' && '✕ Needs Practice'}
            </h4>
            <p className="eval-feedback">{evalResult.feedback}</p>
            <p className="eval-expected">
              <strong>Expected Answer:</strong> {evalResult.expected_answer}
            </p>
            {evalResult.explanation && (
              <p className="eval-explanation">
                <strong>Guru Explanation:</strong> {evalResult.explanation}
              </p>
            )}
            <button className="btn-action primary wide mt-1" onClick={handleNext}>
              {currentIndex + 1 < availableTests.length ? 'Next Test Question →' : 'Restart Tests 🔄'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationTest;
