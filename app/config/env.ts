import Constants from 'expo-constants';

/**
 * Environment configuration module
 * Centralized access to environment variables
 */
export const env = {
  /**
   * Base URL for API requests
   * @throws {Error} if API_BASE_URL is not configured
   */
  get apiBaseUrl(): string {
    const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl;
    
    if (!baseUrl) {
      throw new Error('API_BASE_URL is not configured in app.config.js');
    }
    
    return baseUrl;
  },

  /**
   * Check if running in development mode
   */
  get isDev(): boolean {
    return __DEV__;
  },

  /**
   * Check if running in production mode
   */
  get isProd(): boolean {
    return !__DEV__;
  },
} as const;

export type Env = typeof env;
