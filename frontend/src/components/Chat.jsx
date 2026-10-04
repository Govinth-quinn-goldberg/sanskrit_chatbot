import React, { useState } from 'react';
import { isSpeechSupported, startListening } from '../utils/speech';
import TranslationResult from './TranslationResult';

function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am your Sanskrit Guru. Ask me any Sanskrit grammar, vocabulary, translation, or explanation questions!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Build history excluding warning/error messages (keep last 10 for optimal performance)
    const history = messages
      .filter((msg) => !msg.text.startsWith('⚠️'))
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userText }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || 'Could not connect to backend or Ollama.';
        setError(errorMessage);
        setMessages([
          ...updatedMessages,
          { sender: 'bot', text: `⚠️ ${errorMessage}` }
        ]);
      } else {
        setMessages([
          ...updatedMessages,
          {
            sender: 'bot',
            text: data.reply || '',
            translationData: data.translation_data || null
          }
        ]);
      }
    } catch (err) {
      const connError = 'Could not connect to FastAPI backend on http://localhost:8000.';
      setError(connError);
      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: `⚠️ ${connError}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!isSpeechSupported()) {
      setError("Speech recognition is unavailable in this browser. Try Chrome/Edge or use text input.");
      return;
    }

    if (isListening) return;

    setIsListening(true);
    setError('');

    startListening({
      lang: 'sa-IN',
      onResult: (transcript) => {
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
      },
      onError: (errMessage) => {
        setError(errMessage);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  return (
    <div className="tab-pane">
      <div className="section-header">
        <h2>Sanskrit Chatbot</h2>
        <p>Ask Sanskrit grammar, words, translations, or ask Guru to correct your Sanskrit sentences.</p>
      </div>

      <div className="messages-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === 'bot' ? '🕉️' : '👤'}
            </div>
            <div className="message-content">
              <strong>{msg.sender === 'bot' ? 'Sanskrit Guru' : 'You'}</strong>
              {msg.translationData ? (
                <TranslationResult data={msg.translationData} />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-bubble bot loading">
            <div className="avatar">🕉️</div>
            <div className="message-content">
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <button
          type="button"
          className={`mic-button ${isListening ? 'listening' : ''}`}
          onClick={handleMicClick}
          title={isListening ? 'Listening...' : 'Click to speak'}
          disabled={isLoading}
        >
          {isListening ? '🔴' : '🎤'}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isListening ? 'Listening to your speech...' : "Type or speak your question (e.g. 'How to say hello in Sanskrit?')..."}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default Chat;
