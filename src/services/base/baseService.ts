import axios, { type AxiosInstance } from "axios";
import { getToken, setToken, removeToken} from "../../utils/auth";

interface WebConfig {
  api: {
    baseUrl: string;
  };
  app: {
    name: string;
    version: string;
  };
}

class BaseService {
  private static instance: BaseService;
  private token: string | undefined | null = null;
  private api!: AxiosInstance; // Use definite assignment assertion
  private config: WebConfig | null = null;
  private baseUrl: string = "http://localhost:5140/api"; // fallback

  private constructor() {
    // Initialize token from auth utils
    this.token = getToken();
    // Initialize axios immediately with fallback config
    this.initializeAxios();
    // Then try to load config asynchronously
    this.initializeConfig();
  }

  public static getInstance(): BaseService {
    if (!BaseService.instance) {
      BaseService.instance = new BaseService();
    }
    return BaseService.instance;
  }

  private async initializeConfig(): Promise<void> {
    try {
      console.log('Loading web.config.json...');
      const response = await fetch('/web.config.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.config = await response.json();
      this.baseUrl = this.config!.api.baseUrl;

      // Reinitialize axios with the loaded baseURL
      this.initializeAxios();

    } catch (error) {
      console.error('Failed to load config, using fallback baseURL:', this.baseUrl, error);
      // Keep using fallback configuration
    }
  }

  private initializeAxios(): void {
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000, // Add reasonable timeout
    });

    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Token expired, clear it
          this.setToken(null);
          removeToken();
          // Optionally trigger a global logout event or redirect
          console.log('Token expired due to 401 response');
        }
        return Promise.reject(error);
      }
    );
  }

  // Getter for the baseURL (const-like access)
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Getter for the full config
  getConfig(): WebConfig | null {
    return this.config;
  }

  setToken(token: string | undefined | null) {
    this.token = token;
    if (token) {
      setToken(token);
    } else {
      removeToken();
    }
  }

  get http() {
    return this.api;
  }
}

// Export the singleton instance
export const baseService = BaseService.getInstance();
