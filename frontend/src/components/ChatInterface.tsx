import { useState, useRef, useEffect } from 'react';
import type { Message, AIModel } from '../types';
import './ChatInterface.css';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string, image?: string) => void;
  isGenerating: boolean;
  availableModels: AIModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onLogout: () => void;
  onToggleHistory: () => void;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isGenerating,
  availableModels,
  selectedModel,
  onModelChange,
  onLogout,
  onToggleHistory,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() && !selectedImage) return;
    onSendMessage(input, selectedImage || undefined);
    setInput('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentModel = availableModels.find(m => m.id === selectedModel);

  return (
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <button className="history-toggle" onClick={onToggleHistory}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="header-brand">
          <div className="header-logo">B</div>
          <div>
            <h1>Bill AI</h1>
            <p className="header-subtitle">Antigravity Powered</p>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a Conversation</h2>
            <p>Ask me anything! I'm powered by the latest AI models.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded" className="message-image" />
                  )}
                  <div className="message-text">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="generating-indicator">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="generating-text">Generating...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="input-container">
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" />
            <button className="remove-image" onClick={() => setSelectedImage(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="input-box">
          <div className="input-actions-left">
            <button 
              className="action-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating}
              title="Upload image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            rows={1}
          />

          <div className="input-actions-right">
            <div className="model-selector">
              <button
                className="model-button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                disabled={isGenerating}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              
              {showModelDropdown && (
                <div className="model-dropdown">
                  <div className="dropdown-header">Select AI Model</div>
                  {availableModels.map((model) => (
                    <button
                      key={model.id}
                      className={`dropdown-item ${model.id === selectedModel ? 'active' : ''}`}
                      onClick={() => {
                        onModelChange(model.id);
                        setShowModelDropdown(false);
                      }}
                    >
                      <div className="model-info">
                        <div className="model-name">{model.name}</div>
                        <div className="model-provider">{model.provider}</div>
                      </div>
                      {model.id === selectedModel && (
                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="send-button"
              onClick={handleSend}
              disabled={isGenerating || (!input.trim() && !selectedImage)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>

        {currentModel && (
          <div className="model-indicator">
            Using: <span>{currentModel.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
