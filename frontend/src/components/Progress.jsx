import React, { useState, useEffect } from 'react';
import { getProgress, resetProgress } from '../utils/storage';

function Progress({ progressData }) {
  const [progress, setProgress] = useState(progressData || getProgress());

  useEffect(() => {
    if (progressData) {
      setProgress(progressData);
    }
  }, [progressData]);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your learning progress?")) {
      const reset = resetProgress();
      setProgress(reset);
    }
  };

  const quizAccuracy = progress.quizAttempts > 0
    ? Math.round((progress.quizCorrect / progress.quizAttempts) * 100)
    : 0;

  const convAccuracy = progress.conversationTestsAttempted > 0
    ? Math.round((progress.conversationTestsPassed / progress.conversationTestsAttempted) * 100)
    : 0;

  return (
    <div className="tab-pane single-column">
      <div className="section-header">
        <h2>Your Learning Progress</h2>
        <p>Track your completed lessons, quiz accuracy, and speech practice.</p>
      </div>

      <div className="progress-grid">
        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-info">
            <span className="metric-title">Lessons Completed</span>
            <span className="metric-value">{progress.completedLessons.length} / 8</span>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(progress.completedLessons.length / 8) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🧩</div>
          <div className="metric-info">
            <span className="metric-title">Quiz Accuracy</span>
            <span className="metric-value">{quizAccuracy}%</span>
            <small className="metric-sub">{progress.quizCorrect} correct out of {progress.quizAttempts} questions</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🗣️</div>
          <div className="metric-info">
            <span className="metric-title">Conversation Tests</span>
            <span className="metric-value">{progress.conversationTestsAttempted}</span>
            <small className="metric-sub">{progress.conversationTestsPassed} passed ({convAccuracy}%)</small>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎙️</div>
          <div className="metric-info">
            <span className="metric-title">Pronunciation Practice</span>
            <span className="metric-value">{progress.pronunciationAttempts}</span>
            <small className="metric-sub">{progress.pronunciationSuccesses} successful attempts</small>
          </div>
        </div>
      </div>

      <div className="reset-box">
        <button className="btn-action danger" onClick={handleReset}>
          Reset Progress
        </button>
      </div>
    </div>
  );
}

export default Progress;
