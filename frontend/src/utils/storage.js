const STORAGE_KEY = "sanskrit_chatbot_progress_v1";

const defaultProgress = {
  completedLessons: [],
  quizAttempts: 0,
  quizCorrect: 0,
  conversationTestsAttempted: 0,
  conversationTestsPassed: 0,
  pronunciationAttempts: 0,
  pronunciationSuccesses: 0,
};

export const UNLOCK_THRESHOLD = 6;

export const getProgress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultProgress, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error("Failed to read progress from localStorage", e);
  }
  return defaultProgress;
};

export const saveProgress = (newProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  } catch (e) {
    console.error("Failed to save progress to localStorage", e);
  }
};

export const isLessonCompleted = (completedLessons, lesson) => {
  if (!completedLessons || !Array.isArray(completedLessons)) return false;
  if (completedLessons.includes(lesson.id)) return true;
  if (lesson.numericId && completedLessons.includes(lesson.numericId)) return true;
  return false;
};

export const getCompletedCountForLevel = (levelId, completedLessons, lessonsList) => {
  if (!completedLessons || !Array.isArray(completedLessons)) return 0;
  return lessonsList.filter((l) => isLessonCompleted(completedLessons, l)).length;
};

export const isLevelUnlocked = (levelId, completedLessons = [], beginnerLessons = [], intermediateLessons = []) => {
  if (levelId === "beginner") return true;

  if (levelId === "intermediate") {
    const begCompleted = getCompletedCountForLevel("beginner", completedLessons, beginnerLessons);
    return begCompleted >= UNLOCK_THRESHOLD;
  }

  if (levelId === "advanced") {
    const intCompleted = getCompletedCountForLevel("intermediate", completedLessons, intermediateLessons);
    return intCompleted >= UNLOCK_THRESHOLD;
  }

  return false;
};

export const markLessonComplete = (lessonId) => {
  const current = getProgress();
  if (!current.completedLessons.includes(lessonId)) {
    const updated = {
      ...current,
      completedLessons: [...current.completedLessons, lessonId],
    };
    saveProgress(updated);
    return updated;
  }
  return current;
};

export const recordQuizResult = (isCorrect) => {
  const current = getProgress();
  const updated = {
    ...current,
    quizAttempts: current.quizAttempts + 1,
    quizCorrect: current.quizCorrect + (isCorrect ? 1 : 0),
  };
  saveProgress(updated);
  return updated;
};

export const recordConversationTest = (isPassed) => {
  const current = getProgress();
  const updated = {
    ...current,
    conversationTestsAttempted: current.conversationTestsAttempted + 1,
    conversationTestsPassed: current.conversationTestsPassed + (isPassed ? 1 : 0),
  };
  saveProgress(updated);
  return updated;
};

export const recordPronunciation = (isSuccess) => {
  const current = getProgress();
  const updated = {
    ...current,
    pronunciationAttempts: current.pronunciationAttempts + 1,
    pronunciationSuccesses: current.pronunciationSuccesses + (isSuccess ? 1 : 0),
  };
  saveProgress(updated);
  return updated;
};

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return defaultProgress;
};
