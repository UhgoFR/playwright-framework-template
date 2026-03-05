import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { ApiConfig } from '@/config/api-config';

/**
 * Factory class for creating and managing API request contexts.
 * Provides methods to create different types of authenticated contexts
 * and manages their lifecycle.
 */
export class ApiFactory {
  private static instance: ApiFactory;
  private requestContexts: Map<string, APIRequestContext> = new Map();

  private constructor() {}

  /**
   * Gets the singleton instance of ApiFactory.
   * @returns The ApiFactory instance
   */
  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  /**
   * Creates a basic API request context with default configuration.
   * @param config - Optional configuration overrides
   * @returns Promise resolving to APIRequestContext
   */
  public async createRequestContext(config?: Partial<ApiConfig>): Promise<APIRequestContext> {
    const apiRequest = request;
    const contextConfig = {
      baseURL: config?.baseURL || process.env.API_BASE_URL || 'https://api.example.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config?.headers
      },
      timeout: config?.timeout || 30000,
      ignoreHTTPSErrors: config?.ignoreHTTPSErrors || false
    };

    const context = await apiRequest.newContext(contextConfig);
    const contextKey = this.generateContextKey(contextConfig);
    this.requestContexts.set(contextKey, context);

    return context;
  }

  /**
   * Creates an API request context with Bearer token authentication.
   * @param token - The Bearer token for authentication
   * @param config - Optional configuration overrides
   * @returns Promise resolving to authenticated APIRequestContext
   */
  public async createAuthenticatedRequestContext(
    token: string,
    config?: Partial<ApiConfig>
  ): Promise<APIRequestContext> {
    const apiRequest = request;
    const contextConfig = {
      baseURL: config?.baseURL || process.env.API_BASE_URL || 'https://api.example.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...config?.headers
      },
      timeout: config?.timeout || 30000,
      ignoreHTTPSErrors: config?.ignoreHTTPSErrors || false
    };

    const context = await apiRequest.newContext(contextConfig);
    const contextKey = this.generateContextKey(contextConfig);
    this.requestContexts.set(contextKey, context);

    return context;
  }

  /**
   * Creates an API request context with Basic authentication.
   * @param username - The username for Basic auth
   * @param password - The password for Basic auth
   * @param config - Optional configuration overrides
   * @returns Promise resolving to authenticated APIRequestContext
   */
  public async createBasicAuthRequestContext(
    username: string,
    password: string,
    config?: Partial<ApiConfig>
  ): Promise<APIRequestContext> {
    const apiRequest = request;
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    
    const contextConfig = {
      baseURL: config?.baseURL || process.env.API_BASE_URL || 'https://api.example.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`,
        ...config?.headers
      },
      timeout: config?.timeout || 30000,
      ignoreHTTPSErrors: config?.ignoreHTTPSErrors || false
    };

    const context = await apiRequest.newContext(contextConfig);
    const contextKey = this.generateContextKey(contextConfig);
    this.requestContexts.set(contextKey, context);

    return context;
  }

  /**
   * Creates an API request context with API key authentication.
   * @param apiKey - The API key for authentication
   * @param apiKeyHeader - The header name for the API key (default: 'X-API-Key')
   * @param config - Optional configuration overrides
   * @returns Promise resolving to authenticated APIRequestContext
   */
  public async createApiKeyRequestContext(
    apiKey: string,
    apiKeyHeader: string = 'X-API-Key',
    config?: Partial<ApiConfig>
  ): Promise<APIRequestContext> {
    const apiRequest = request;
    
    const contextConfig = {
      baseURL: config?.baseURL || process.env.API_BASE_URL || 'https://api.example.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        [apiKeyHeader]: apiKey,
        ...config?.headers
      },
      timeout: config?.timeout || 30000,
      ignoreHTTPSErrors: config?.ignoreHTTPSErrors || false
    };

    const context = await apiRequest.newContext(contextConfig);
    const contextKey = this.generateContextKey(contextConfig);
    this.requestContexts.set(contextKey, context);

    return context;
  }

  /**
   * Closes a specific API request context and removes it from the factory.
   * @param context - The API request context to close
   */
  public async closeRequestContext(context: APIRequestContext): Promise<void> {
    await context.dispose();
    for (const [key, value] of this.requestContexts.entries()) {
      if (value === context) {
        this.requestContexts.delete(key);
        break;
      }
    }
  }

  /**
   * Closes all managed API request contexts.
   * Useful for cleanup in test teardown.
   */
  public async closeAllRequestContexts(): Promise<void> {
    for (const context of this.requestContexts.values()) {
      await context.dispose();
    }
    this.requestContexts.clear();
  }

  /**
   * Generates a unique key for storing request contexts.
   * @param config - The configuration object
   * @returns String key for the context
   */
  private generateContextKey(config: any): string {
    return JSON.stringify(config);
  }

  /**
   * Gets the count of active request contexts.
   * @returns Number of active contexts
   */
  public getRequestContextCount(): number {
    return this.requestContexts.size;
  }
}
