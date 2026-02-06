export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  maxTokens?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  availableModels: AIModel[];
}
