import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ChatInterface from './components/ChatInterface';
import HistoryDrawer from './components/HistoryDrawer';
import type { Message, Conversation, User, AIModel } from './types';
import { storage, fetchAvailableModels, sendMessage } from './utils/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check if this is an OAuth success callback
      if (window.location.pathname === '/auth/success') {
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const userId = urlParams.get('user_id');
        const email = urlParams.get('email');
        const name = urlParams.get('name');
        const picture = urlParams.get('picture');

        if (accessToken && userId && email) {
          const newUser: User = {
            id: userId,
            email: email,
            name: name || '',
            picture: picture || undefined,
            accessToken: accessToken,
            refreshToken: refreshToken || '',
          };

          storage.setUser(newUser);
          setUser(newUser);
          setIsAuthenticated(true);

          // Fetch available models
          try {
            const models = await fetchAvailableModels(accessToken);
            setAvailableModels(models);
            
            if (models.length > 0) {
              setSelectedModel(models[0].id);
              storage.setSelectedModel(models[0].id);
            }
          } catch (error) {
            console.error('Failed to fetch models:', error);
          }

          // Clean up URL and redirect to home
          window.history.replaceState({}, document.title, '/');
        }
      }
      // Check if OAuth error
      else if (window.location.pathname === '/auth/error') {
        const errorMessage = urlParams.get('message') || 'Authentication failed';
        alert(`Login failed: ${errorMessage}`);
        window.history.replaceState({}, document.title, '/');
      }
    };

    handleOAuthCallback();
  }, []);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Check if user is already authenticated
      const savedUser = storage.getUser();
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);

        // Load conversations
        const savedConversations = storage.getConversations();
        setConversations(savedConversations);

        // Load current conversation
        const currentId = storage.getCurrentConversationId();
        if (currentId && savedConversations.find((c: Conversation) => c.id === currentId)) {
          setCurrentConversationId(currentId);
        } else if (savedConversations.length > 0) {
          setCurrentConversationId(savedConversations[0].id);
          storage.setCurrentConversationId(savedConversations[0].id);
        }

        // Fetch available models
        try {
          const models = await fetchAvailableModels(savedUser.accessToken);
          setAvailableModels(models);

          // Load selected model
          const savedModel = storage.getSelectedModel();
          if (savedModel && models.find(m => m.id === savedModel)) {
            setSelectedModel(savedModel);
          } else if (models.length > 0) {
            setSelectedModel(models[0].id);
            storage.setSelectedModel(models[0].id);
          }
        } catch (error) {
          console.error('Failed to fetch models:', error);
        }
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  // Handle login - now just a placeholder since OAuth redirects
  const handleLogin = () => {
    // OAuth flow is initiated in LoginPage component
  };

  // Handle logout
  const handleLogout = () => {
    storage.removeUser();
    setUser(null);
    setIsAuthenticated(false);
    setConversations([]);
    setCurrentConversationId(null);
    setAvailableModels([]);
  };

  // Get current conversation
  const getCurrentConversation = (): Conversation | null => {
    return conversations.find(c => c.id === currentConversationId) || null;
  };

  // Create new conversation
  const createNewConversation = (): Conversation => {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return newConv;
  };

  // Handle send message
  const handleSendMessage = async (content: string, image?: string) => {
    let conversation = getCurrentConversation();
    
    // Create new conversation if none exists
    if (!conversation) {
      conversation = createNewConversation();
      const newConversations = [conversation, ...conversations];
      setConversations(newConversations);
      setCurrentConversationId(conversation.id);
      storage.setConversations(newConversations);
      storage.setCurrentConversationId(conversation.id);
    }

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      image,
    };

    const updatedConversation: Conversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      updatedAt: Date.now(),
      title: conversation.messages.length === 0 ? content.slice(0, 50) : conversation.title,
    };

    const updatedConversations = conversations.map(c =>
      c.id === updatedConversation.id ? updatedConversation : c
    );
    setConversations(updatedConversations);
    storage.setConversations(updatedConversations);

    // Generate AI response
    setIsGenerating(true);
    try {
      const stream = await sendMessage(
        content,
        updatedConversation.messages,
        selectedModel,
        user!.accessToken,
        image
      );

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      // Create assistant message
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantContent += chunk;
        assistantMessage.content = assistantContent;

        // Update conversation with streaming content
        const streamingConversation: Conversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, assistantMessage],
          updatedAt: Date.now(),
        };

        const streamingConversations = conversations.map(c =>
          c.id === streamingConversation.id ? streamingConversation : c
        );
        setConversations(streamingConversations);
      }

      // Save final state
      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: Date.now(),
      };

      const finalConversations = conversations.map(c =>
        c.id === finalConversation.id ? finalConversation : c
      );
      setConversations(finalConversations);
      storage.setConversations(finalConversations);
    } catch (error) {
      console.error('Failed to generate response:', error);
      alert('Failed to generate response. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle model change
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    storage.setSelectedModel(modelId);
  };

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    storage.setCurrentConversationId(id);
    setIsHistoryOpen(false);
  };

  // Handle new conversation
  const handleNewConversation = () => {
    const newConv = createNewConversation();
    const newConversations = [newConv, ...conversations];
    setConversations(newConversations);
    setCurrentConversationId(newConv.id);
    storage.setConversations(newConversations);
    storage.setCurrentConversationId(newConv.id);
    setIsHistoryOpen(false);
  };

  // Handle delete conversation
  const handleDeleteConversation = (id: string) => {
    const newConversations = conversations.filter(c => c.id !== id);
    setConversations(newConversations);
    storage.setConversations(newConversations);

    if (currentConversationId === id) {
      const newCurrentId = newConversations.length > 0 ? newConversations[0].id : null;
      setCurrentConversationId(newCurrentId);
      if (newCurrentId) {
        storage.setCurrentConversationId(newCurrentId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Bill AI...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentConversation = getCurrentConversation();

  return (
    <div className="app">
      <ChatInterface
        messages={currentConversation?.messages || []}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        availableModels={availableModels}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onLogout={handleLogout}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
      />
      <HistoryDrawer
        isOpen={isHistoryOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onClose={() => setIsHistoryOpen(false)}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
    </div>
  );
}

export default App;
