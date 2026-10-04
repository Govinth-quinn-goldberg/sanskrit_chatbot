import React, { useState } from 'react';
import { quizzesData } from '../data/quizzes';
import { recordQuizResult } from '../utils/storage';

function Quiz({ onProgressChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const currentQuiz = quizzesData[currentIndex];

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === currentQuiz.correctAnswer;
    setIsSubmitted(true);
    setAttempted((prev) => prev + 1);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const updatedProgress = recordQuizResult(isCorrect);
    if (onProgressChange) onProgressChange(updatedProgress);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex + 1 < quizzesData.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or stay at summary
      setCurrentIndex(0);
    }
  };

  return (
    <div className="tab-pane single-column">
      <div className="section-header">
        <h2>Sanskrit Knowledge Quizzes</h2>
        <p>Test your understanding of Sanskrit basics, grammar, and vocabulary.</p>
      </div>

      <div className="quiz-stats-bar">
        <span>Question: {currentIndex + 1} / {quizzesData.length}</span>
        <span>Current Score: {score} / {attempted}</span>
      </div>

      <div className="quiz-card">
        <h3 className="question-title">{currentQuiz.question}</h3>

        <div className="options-list">
          {currentQuiz.options.map((opt, idx) => {
            let stateClass = '';
            if (selectedOption === idx) stateClass = 'selected';
            if (isSubmitted) {
              if (idx === currentQuiz.correctAnswer) stateClass = 'correct';
              else if (selectedOption === idx) stateClass = 'incorrect';
            }

            return (
              <button
                key={idx}
                className={`option-btn ${stateClass}`}
                onClick={() => !isSubmitted && setSelectedOption(idx)}
                disabled={isSubmitted}
              >
                <span className="opt-letter">{String.fromCharCode(65 + idx)}.</span>
                <span className="opt-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {!isSubmitted ? (
          <button
            className="btn-action primary wide mt-1"
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit Answer
          </button>
        ) : (
          <div className="quiz-feedback-box">
            <div className={`feedback-header ${selectedOption === currentQuiz.correctAnswer ? 'success' : 'fail'}`}>
              {selectedOption === currentQuiz.correctAnswer ? '✓ Correct Answer!' : '✕ Incorrect'}
            </div>
            <p className="explanation-text">
              <strong>Explanation: </strong> {currentQuiz.explanation}
            </p>
            <button className="btn-action primary wide mt-1" onClick={handleNext}>
              {currentIndex + 1 < quizzesData.length ? 'Next Question →' : 'Restart Quiz 🔄'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
