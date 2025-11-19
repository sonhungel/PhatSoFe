import axios, { type AxiosInstance } from "axios";

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
  private token: string | undefined | null = null;
  private api!: AxiosInstance; // Use definite assignment assertion
  private config: WebConfig | null = null;
  private baseUrl: string = "http://localhost:5140/api"; // fallback

  constructor() {
    this.initializeConfig();
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

      console.log('Config loaded successfully. Base URL:', this.baseUrl);

      // Reinitialize axios with the loaded baseURL
      this.initializeAxios();

    } catch (error) {
      console.error('Failed to load config, using fallback baseURL:', this.baseUrl, error);
      // Use fallback and initialize axios
      this.initializeAxios();
    }
  }

  private initializeAxios(): void {
    this.api = axios.create({
      baseURL: this.baseUrl,
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
  }

  get http() {
    return this.api;
  }
}

export const baseService = new BaseService();
