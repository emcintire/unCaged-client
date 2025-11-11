import AsyncStorage from '@react-native-async-storage/async-storage';
import { showErrorToast } from '../config/helperFunctions';

const API_BASE_URL = 'https://uncaged-server.herokuapp.com/api';

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token && { 'x-auth-token': token }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Handle text responses
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = typeof data === 'string' ? data : data.message || 'An error occurred';
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      showErrorToast(errorMessage);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
