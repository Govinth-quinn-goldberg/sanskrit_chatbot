import React, { useState } from 'react';

function App() {
  // 1. React State to store chat messages history
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am your Sanskrit Teacher. Ask me any question to start learning Sanskrit!'
    }
  ]);

  // 2. React State for current user text input field
  const [inputMessage, setInputMessage] = useState('');

  // 3. React State to show loading spinner/indicator while waiting for backend
  const [isLoading, setIsLoading] = useState(false);

  // 4. React State to store and show error messages if something goes wrong
  const [error, setError] = useState('');

  // Function executed when user clicks 'Send' or presses Enter
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Do nothing if input is empty or if waiting for previous request
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Add user's question to messages list immediately
    const updatedMessages = [
      ...messages,
      { sender: 'user', text: userText }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Send message to FastAPI backend using standard JavaScript fetch()
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error sent by FastAPI backend (e.g., Ollama not running)
        const errorMessage = data.detail || 'Could not connect to Ollama. Make sure Ollama is running.';
        setError(errorMessage);
        setMessages([
          ...updatedMessages,
          { sender: 'bot', text: `⚠️ ${errorMessage}` }
        ]);
      } else {
        // Successfully received Llama 3.2 3B reply
        setMessages([
          ...updatedMessages,
          { sender: 'bot', text: data.reply }
        ]);
      }
    } catch (err) {
      // Backend server is offline or unreachable
      const connError = 'Could not connect to FastAPI backend. Make sure the backend server is running on http://localhost:8000.';
      setError(connError);
      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: `⚠️ ${connError}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Header section */}
      <header className="chat-header">
        <h1>Sanskrit Learning Chatbot</h1>
        <p>Learn Sanskrit with your AI Guru (Powered by Ollama & Llama 3.2 3B)</p>
      </header>

      {/* Messages area */}
      <div className="messages-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === 'bot' ? '🕉️' : '👤'}
            </div>
            <div className="message-content">
              <strong>{msg.sender === 'bot' ? 'Sanskrit Guru' : 'You'}</strong>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="message-bubble bot loading">
            <div className="avatar">🕉️</div>
            <div className="message-content">
              <p>Thinking and generating your Sanskrit lesson...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error alert banner */}
      {error && <div className="error-banner">{error}</div>}

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question (e.g. 'Teach me Sanskrit pronouns')..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;
