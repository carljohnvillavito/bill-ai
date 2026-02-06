import type { User, AIModel } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STORAGE_KEYS = {
  USER: 'bill_ai_user',
  CONVERSATIONS: 'bill_ai_conversations',
  CURRENT_CONVERSATION: 'bill_ai_current_conversation',
  SELECTED_MODEL: 'bill_ai_selected_model',
};

export const storage = {
  // User
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Conversations
  getConversations: () => {
    const conversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return conversations ? JSON.parse(conversations) : [];
  },
  setConversations: (conversations: any[]) => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  },

  // Current conversation
  getCurrentConversationId: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  },
  setCurrentConversationId: (id: string) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
  },

  // Selected model
  getSelectedModel: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);
  },
  setSelectedModel: (modelId: string) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
  },
};

// Get OAuth URL from backend
export const getOAuthUrl = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/auth/url`);
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Failed to get OAuth URL:', error);
    throw error;
  }
};

// Initiate OAuth flow
export const initiateOAuth = async () => {
  try {
    const url = await getOAuthUrl();
    // Redirect to Google OAuth
    window.location.href = url;
  } catch (error) {
    console.error('Failed to initiate OAuth:', error);
    throw error;
  }
};

// Exchange OAuth code for tokens (alternative to callback)
export const exchangeCodeForTokens = async (code: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to exchange code:', error);
    throw error;
  }
};

// Fetch available models from backend
export const fetchAvailableModels = async (accessToken: string): Promise<AIModel[]> => {
  try {
    const response = await fetch(`${API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch models:', error);
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

// Send chat message with real streaming
export const sendMessage = async (
  message: string,
  conversationHistory: any[],
  model: string,
  accessToken: string,
  image?: string
): Promise<ReadableStream> => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
        model,
        image,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    // Handle Server-Sent Events (SSE) streaming
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6);
                
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    controller.enqueue(new TextEncoder().encode(parsed.text));
                  } else if (parsed.error) {
                    throw new Error(parsed.error);
                  }
                } catch (e) {
                  // Ignore parse errors for non-JSON lines
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};
