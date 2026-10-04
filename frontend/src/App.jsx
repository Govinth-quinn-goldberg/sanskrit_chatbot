import React, { useState } from 'react';
import Chat from './components/Chat';
import Lessons from './components/Lessons';
import Quiz from './components/Quiz';
import ConversationTest from './components/ConversationTest';
import PronunciationTest from './components/PronunciationTest';
import Progress from './components/Progress';
import { getProgress } from './utils/storage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [progress, setProgress] = useState(getProgress());

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
  };

  return (
    <div className="app-container">
      {/* Header section */}
      <header className="app-header">
        <div className="header-title">
          <h1>Sanskrit Learning Chatbot</h1>
          <p>Learn Sanskrit with your AI Guru (Powered by Ollama & Llama 3.2 3B)</p>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
        <button
          className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          📚 Lessons
        </button>
        <button
          className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🧩 Quiz
        </button>
        <button
          className={`tab-btn ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => setActiveTab('test')}
        >
          🗣️ Conversation Test
        </button>
        <button
          className={`tab-btn ${activeTab === 'pronunciation' ? 'active' : ''}`}
          onClick={() => setActiveTab('pronunciation')}
        >
          🎙️ Pronunciation
        </button>
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          📊 Progress
        </button>
      </nav>

      {/* Active Tab View */}
      <main className="tab-content">
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'lessons' && <Lessons onProgressChange={handleProgressChange} />}
        {activeTab === 'quiz' && <Quiz onProgressChange={handleProgressChange} />}
        {activeTab === 'test' && <ConversationTest onProgressChange={handleProgressChange} />}
        {activeTab === 'pronunciation' && <PronunciationTest onProgressChange={handleProgressChange} />}
        {activeTab === 'progress' && <Progress progressData={progress} />}
      </main>
    </div>
  );
}

export default App;
