import axios from "axios";

// API Configuration
const getApiBaseUrl = () => {
  // For production, use the environment variable
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL ||
      "https://smart-content-generator.onrender.com"
    );
  }
  // For development, use localhost
  return "http://localhost:5000";
};

const API_BASE_URL = getApiBaseUrl();

// Add debug logging to see actual API calls
console.log("🌐 Environment:", import.meta.env.MODE);
console.log("🌐 Production mode:", import.meta.env.PROD);
console.log("🌐 API Base URL:", API_BASE_URL);
console.log("🌐 VITE_API_URL from env:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

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
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const contentService = {
  // Health check endpoint
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      // Try to make a simple API call to check connectivity
      const response = await api.get("/api/content");
      return { status: "success", message: "API is reachable" };
    } catch (error: any) {
      console.error("Health check failed:", error);
      return {
        status: "error",
        message: `API unreachable: ${error.response?.status || error.message}`,
      };
    }
  },

  // Generate content from text input, file, or direct content
  async generateContent(
    data: FormData | ContentRequest
  ): Promise<ContentResponse> {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};

    const response = await api.post("/api/content/generate", data, { headers });
    return response.data;
  },

  // Send chat message and get AI response
  async sendMessage(message: string): Promise<ChatMessage> {
    const response = await api.post("/api/content/chat", { message });
    return response.data;
  },

  // Generate image description
  async generateImage(prompt: string): Promise<ContentResponse> {
    const response = await api.post("/api/content/generate-image", { prompt });
    return response.data;
  },

  // Get all contents
  async getAllContents(): Promise<ContentResponse[]> {
    const response = await api.get("/api/content");
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
    const response = await api.get("/api/content/favorites");
    return response.data;
  },

  // Get Pexels images
  async getPexelsImages(
    category: string,
    perPage?: number
  ): Promise<{ url: string; photographer: string; alt: string }[]> {
    const response = await api.get("/api/content/pexels-images", {
      params: { category, perPage },
    });
    return response.data;
  },
};

// Export API_BASE_URL for debugging
export { API_BASE_URL };
