import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ContentResponse {
  _id: string;
  topic: string;
  type: string;
  content: string;
  imageUrl?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface ContentRequest {
  topic: string;
  type: string;
  content?: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const contentService = {
  // Generate content from text input, file, or direct content
  async generateContent(data: FormData | ContentRequest): Promise<ContentResponse> {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
    
    const response = await api.post('/api/content/generate', data, { headers });
    return response.data;
  },

  // Send chat message and get AI response
  async sendMessage(message: string): Promise<ChatMessage> {
    const response = await api.post('/api/content/chat', { message });
    return response.data;
  },

  // Generate image description
  async generateImage(prompt: string): Promise<ContentResponse> {
    const response = await api.post('/api/content/generate-image', { prompt });
    return response.data;
  },

  // Get all contents
  async getAllContents(): Promise<ContentResponse[]> {
    const response = await api.get('/api/content');
    return response.data;
  },

  // Get content by ID
  async getContentById(id: string): Promise<ContentResponse> {
    const response = await api.get(`/api/content/${id}`);
    return response.data;
  },

  // Toggle favorite status
  async toggleFavorite(id: string): Promise<ContentResponse> {
    const response = await api.post(`/api/content/${id}/favorite`);
    return response.data;
  },

  // Get favorite contents
  async getFavorites(): Promise<ContentResponse[]> {
    const response = await api.get('/api/content/favorites');
    return response.data;
  },

  // Get Pexels images
  async getPexelsImages(category: string, perPage?: number): Promise<{ url: string; photographer: string; alt: string; }[]> {
    const response = await api.get('/api/content/pexels-images', {
      params: { category, perPage }
    });
    return response.data;
  }
};
