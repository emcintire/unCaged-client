import AsyncStorage from '@react-native-async-storage/async-storage';
import { showErrorToast } from '../config/helperFunctions';

const API_BASE_URL = 'https://uncaged-server.herokuapp.com/api';

export type ApiResponse<ReturnValue> = {
  data: ReturnValue | null;
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

  private async request<ReturnValue>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ReturnValue> {
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
      let data: unknown;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = typeof data === 'string' ? data : (data as { message?: string }).message || 'An error occurred';
        throw new Error(errorMessage);
      }

      return data as ReturnValue;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      showErrorToast(errorMessage);
      throw error;
    }
  }

  async get<ReturnValue>(endpoint: string, options?: RequestInit): Promise<ReturnValue> {
    return this.request<ReturnValue>(endpoint, { ...options, method: 'GET' });
  }

  async post<ReturnValue>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ReturnValue> {
    return this.request<ReturnValue>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<ReturnValue>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ReturnValue> {
    return this.request<ReturnValue>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<ReturnValue>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ReturnValue> {
    return this.request<ReturnValue>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
