import React, { useState } from 'react';
import { levelInfo, lessonsByLevel, UNLOCK_THRESHOLD } from '../data/lessons';
import { getProgress, markLessonComplete, isLessonCompleted, isLevelUnlocked, getCompletedCountForLevel } from '../utils/storage';
import { speakSanskrit, stopSpeaking } from '../utils/speech';

function Lessons({ onProgressChange }) {
  const [selectedLevelId, setSelectedLevelId] = useState(null); // null = Level Selection View
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [progress, setProgress] = useState(getProgress());
  const [activeSpeakingId, setActiveSpeakingId] = useState(null);
  const [ttsError, setTtsError] = useState('');

  const completedList = progress.completedLessons || [];

  const begLessons = lessonsByLevel.beginner;
  const intLessons = lessonsByLevel.intermediate;
  const advLessons = lessonsByLevel.advanced;

  const begCompleted = getCompletedCountForLevel('beginner', completedList, begLessons);
  const intCompleted = getCompletedCountForLevel('intermediate', completedList, intLessons);
  const advCompleted = getCompletedCountForLevel('advanced', completedList, advLessons);

  const handleLevelClick = (levelId) => {
    const unlocked = isLevelUnlocked(levelId, completedList, begLessons, intLessons);
    if (!unlocked) return;

    setSelectedLevelId(levelId);
    // Default to first lesson of selected level
    const levelLessons = lessonsByLevel[levelId] || [];
    if (levelLessons.length > 0) {
      setSelectedLessonId(levelLessons[0].id);
    }
  };

  const handleBackToLevels = () => {
    setSelectedLevelId(null);
    setSelectedLessonId(null);
  };

  const handleComplete = (lessonId) => {
    const updated = markLessonComplete(lessonId);
    setProgress(updated);
    if (onProgressChange) onProgressChange(updated);
  };

  const handleSpeak = (text, id) => {
    setTtsError('');
    if (activeSpeakingId === id) {
      stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }

    setActiveSpeakingId(id);
    const started = speakSanskrit(text, {
      onStart: () => setActiveSpeakingId(id),
      onEnd: () => setActiveSpeakingId(null),
      onError: (err) => {
        setActiveSpeakingId(null);
        setTtsError(err);
      }
    });

    if (!started && !ttsError) {
      setActiveSpeakingId(null);
    }
  };

  // Render LEVEL SELECTOR VIEW if no level opened
  if (!selectedLevelId) {
    const levels = [
      {
        ...levelInfo.beginner,
        completed: begCompleted,
        total: begLessons.length,
        unlocked: true,
        reqText: ""
      },
      {
        ...levelInfo.intermediate,
        completed: intCompleted,
        total: intLessons.length,
        unlocked: isLevelUnlocked('intermediate', completedList, begLessons, intLessons),
        reqText: `Complete ${UNLOCK_THRESHOLD} Beginner lessons to unlock.`
      },
      {
        ...levelInfo.advanced,
        completed: advCompleted,
        total: advLessons.length,
        unlocked: isLevelUnlocked('advanced', completedList, begLessons, intLessons),
        reqText: `Complete ${UNLOCK_THRESHOLD} Intermediate lessons to unlock.`
      }
    ];

    return (
      <div className="tab-pane single-column">
        <div className="section-header">
          <h2>Lessons</h2>
          <p>Choose a learning level to start mastering Sanskrit grammar, vocabulary, and conversation.</p>
        </div>

        <div className="level-cards-container">
          {levels.map((lvl) => {
            const percent = Math.round((lvl.completed / lvl.total) * 100);

            return (
              <div
                key={lvl.id}
                className={`level-selection-card ${lvl.unlocked ? 'unlocked' : 'locked'}`}
                onClick={() => handleLevelClick(lvl.id)}
              >
                <div className="level-card-top">
                  <div className="level-badge-title">
                    <span className="level-badge" style={{ backgroundColor: lvl.unlocked ? lvl.color : '#475569' }}>
                      {lvl.unlocked ? lvl.badge : `🔒 ${lvl.name}`}
                    </span>
                    <h3>{lvl.name} Level</h3>
                  </div>

                  {!lvl.unlocked && (
                    <span className="lock-indicator">🔒 Locked</span>
                  )}
                </div>

                <p className="level-desc">{lvl.description}</p>

                {lvl.unlocked ? (
                  <div className="level-progress-section">
                    <div className="level-progress-info">
                      <span>{lvl.total} lessons</span>
                      <span>{lvl.completed} / {lvl.total} completed ({percent}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percent}%`, backgroundColor: lvl.color }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="lock-requirement-box">
                    🔒 {lvl.reqText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render LEVEL LESSONS DETAIL VIEW
  const currentLevelInfo = levelInfo[selectedLevelId];
  const currentLevelLessons = lessonsByLevel[selectedLevelId] || [];
  const currentLesson = currentLevelLessons.find((l) => l.id === selectedLessonId) || currentLevelLessons[0];
  const isCurrentCompleted = isLessonCompleted(completedList, currentLesson);

  return (
    <div className="tab-pane lessons-layout">
      {/* Header bar with Back button */}
      <div className="level-header-bar">
        <button type="button" className="btn-back" onClick={handleBackToLevels}>
          ← Back to Levels
        </button>
        <span className="current-level-title" style={{ color: currentLevelInfo.color }}>
          {currentLevelInfo.badge} Level ({currentLevelLessons.length} Lessons)
        </span>
      </div>

      {/* Left Column: Lesson Navigation List */}
      <div className="sidebar-list">
        <h3>{currentLevelInfo.name} Lessons</h3>
        <p className="subtext">Select a lesson to study</p>
        <div className="lesson-menu">
          {currentLevelLessons.map((lesson, idx) => {
            const done = isLessonCompleted(completedList, lesson);
            const isActive = currentLesson.id === lesson.id;

            return (
              <div
                key={lesson.id}
                className={`lesson-item ${isActive ? 'active' : ''} ${done ? 'completed' : ''}`}
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <div className="lesson-item-header">
                  <span>{lesson.title}</span>
                  {done ? (
                    <span className="badge-complete">✓</span>
                  ) : (
                    <span className="badge-arrow">→</span>
                  )}
                </div>
                <small>{lesson.shortExplanation}</small>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Selected Lesson Content */}
      <div className="content-detail">
        <div className="lesson-card">
          <div className="card-header">
            <div>
              <span className="lesson-tag">{currentLevelInfo.name} • Lesson {currentLevelLessons.findIndex(l => l.id === currentLesson.id) + 1} of {currentLevelLessons.length}</span>
              <h2>{currentLesson.title}</h2>
            </div>

            {isCurrentCompleted ? (
              <span className="badge-complete large">✓ Lesson Completed</span>
            ) : (
              <button
                type="button"
                className="btn-action primary"
                onClick={() => handleComplete(currentLesson.id)}
              >
                Mark as Complete
              </button>
            )}
          </div>

          <div className="lesson-body">
            {/* Learning Objective Box */}
            {currentLesson.objective && (
              <div className="objective-box">
                <h4>🎯 Learning Objective</h4>
                <p>{currentLesson.objective}</p>
              </div>
            )}

            {/* Explanation Box */}
            <div className="explanation-box">
              <h3>Explanation</h3>
              <p className="lesson-text">{currentLesson.explanation}</p>
            </div>

            {/* TTS Error Banner */}
            {ttsError && (
              <div className="tts-warning-banner">
                ⚠️ {ttsError}
              </div>
            )}

            {/* Examples with 🔊 Listen buttons */}
            {currentLesson.examples && currentLesson.examples.length > 0 && (
              <div className="examples-section">
                <h3>Sanskrit Examples & Meanings</h3>
                <div className="examples-grid">
                  {currentLesson.examples.map((ex, idx) => (
                    <div key={idx} className="example-card">
                      <div className="example-header">
                        <span className="sanskrit-text">{ex.sanskrit}</span>
                        <button
                          type="button"
                          className={`mini-listen-btn ${activeSpeakingId === `ex-${idx}` ? 'speaking' : ''}`}
                          onClick={() => handleSpeak(ex.sanskrit, `ex-${idx}`)}
                          title={`Listen to ${ex.sanskrit}`}
                        >
                          🔊
                        </button>
                      </div>
                      <span className="meaning-text">{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Box */}
            {currentLesson.practice && (
              <div className="practice-box">
                <h4>💡 Practice Activity</h4>
                <p>{currentLesson.practice}</p>
              </div>
            )}
          </div>

          {!isCurrentCompleted && (
            <div className="card-footer">
              <button
                type="button"
                className="btn-action primary wide"
                onClick={() => handleComplete(currentLesson.id)}
              >
                Complete Lesson {currentLesson.title}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lessons;
