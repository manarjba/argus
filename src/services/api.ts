import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Export interfaces
export interface Article {
  id: number;
  title: string;
  url: string;
  content: string;
  summary: string;
  source: string;
  threat_type: string;
  severity: string;
  iocs: any;
  published_date: string | null;
  created_at: string;
}

export interface SystemStatus {
  ai_processing: boolean;
  rss_feeds: number;
  ioc_extraction: boolean;
  message: string;
}

export interface BatchStats {
  total_articles: number;
  processed_articles: number;
  articles_with_iocs: number;
  processing_percentage: number;
}

// API class
class ArgusApi {
  async getArticles(): Promise<Article[]> {
    try {
      console.log('Fetching articles from:', `${API_BASE_URL}/articles/`);
      const response = await api.get('/articles/');
      console.log('Articles response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  async getArticle(id: number): Promise<Article> {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  }

  async fetchArticles(): Promise<any> {
    const response = await api.post('/operations/fetch-articles');
    return response.data;
  }

  async processArticle(id: number): Promise<any> {
    const response = await api.post(`/articles/${id}/process`);
    return response.data;
  }

  async extractIOCs(id: number): Promise<any> {
    const response = await api.post(`/articles/${id}/extract-iocs`);
    return response.data;
  }

  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await api.get('/operations/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      // Return a default status if API fails
      return {
        ai_processing: false,
        rss_feeds: 0,
        ioc_extraction: false,
        message: 'Unable to connect to API'
      };
    }
  }

  async getBatchStats(): Promise<BatchStats> {
    try {
      const response = await api.get('/batch/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching batch stats:', error);
      // Return default stats if API fails
      return {
        total_articles: 0,
        processed_articles: 0,
        articles_with_iocs: 0,
        processing_percentage: 0
      };
    }
  }

  async processAllArticles(): Promise<any> {
    const response = await api.post('/batch/process-all');
    return response.data;
  }
}

// Export the API instance
export const argusApi = new ArgusApi();

// Default export
export default argusApi;