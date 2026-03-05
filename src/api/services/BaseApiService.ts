import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '@/utils/ApiHelper';
import { ApiConfig, HttpMethod } from '@/config/api-config';

/**
 * Base service class for API testing.
 * Provides common functionality for making HTTP requests,
 * validation, and response handling.
 * 
 * Extend this class to create service-specific API classes.
 */
export abstract class BaseApiService {
  protected requestContext: APIRequestContext;
  protected baseURL: string;

  /**
   * Creates an instance of BaseApiService.
   * @param requestContext - The API request context for making HTTP calls
   * @param baseURL - Optional base URL override
   */
  constructor(requestContext: APIRequestContext, baseURL?: string) {
    this.requestContext = requestContext;
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://api.example.com';
  }

  /**
   * Makes an HTTP request with the specified method and options.
   * @param method - The HTTP method to use
   * @param endpoint - The API endpoint (relative to base URL)
   * @param options - Optional request configuration
   * @returns Promise resolving to APIResponse
   */
  protected async makeRequest(
    method: HttpMethod,
    endpoint: string,
    options?: {
      data?: any;
      params?: Record<string, string>;
      headers?: Record<string, string>;
      form?: Record<string, string>;
      multipart?: Record<string, any>;
      timeout?: number;
    }
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    const requestData: any = {};

    if (options?.data) {
      requestData.data = options.data;
    }

    if (options?.params) {
      requestData.params = options.params;
    }

    if (options?.headers) {
      requestData.headers = options.headers;
    }

    if (options?.form) {
      requestData.form = options.form;
    }

    if (options?.multipart) {
      requestData.multipart = options.multipart;
    }

    if (options?.timeout) {
      requestData.timeout = options.timeout;
    }

    await ApiHelper.logCurlCommand(this.requestContext, endpoint, method, requestData);

    switch (method) {
      case 'GET':
        return await this.requestContext.get(url, requestData);
      case 'POST':
        return await this.requestContext.post(url, requestData);
      case 'PUT':
        return await this.requestContext.put(url, requestData);
      case 'PATCH':
        return await this.requestContext.patch(url, requestData);
      case 'DELETE':
        return await this.requestContext.delete(url, requestData);
      case 'HEAD':
        return await this.requestContext.head(url, requestData);
      case 'OPTIONS':
        return await this.requestContext.fetch(url, { ...requestData, method: 'OPTIONS' });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  /**
   * Makes a GET request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param options - Optional request configuration (excluding data)
   * @returns Promise resolving to APIResponse
   */
  protected async get(endpoint: string, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('GET', endpoint, options);
  }

  /**
   * Makes a POST request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param data - The request body data
   * @param options - Optional request configuration
   * @returns Promise resolving to APIResponse
   */
  protected async post(endpoint: string, data?: any, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('POST', endpoint, { ...options, data });
  }

  /**
   * Makes a PUT request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param data - The request body data
   * @param options - Optional request configuration
   * @returns Promise resolving to APIResponse
   */
  protected async put(endpoint: string, data?: any, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('PUT', endpoint, { ...options, data });
  }

  /**
   * Makes a PATCH request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param data - The request body data
   * @param options - Optional request configuration
   * @returns Promise resolving to APIResponse
   */
  protected async patch(endpoint: string, data?: any, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('PATCH', endpoint, { ...options, data });
  }

  /**
   * Makes a DELETE request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param options - Optional request configuration (excluding data)
   * @returns Promise resolving to APIResponse
   */
  protected async delete(endpoint: string, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('DELETE', endpoint, options);
  }

  /**
   * Makes a HEAD request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param options - Optional request configuration (excluding data)
   * @returns Promise resolving to APIResponse
   */
  protected async head(endpoint: string, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('HEAD', endpoint, options);
  }

  /**
   * Makes an OPTIONS request to the specified endpoint.
   * @param endpoint - The API endpoint
   * @param options - Optional request configuration (excluding data)
   * @returns Promise resolving to APIResponse
   */
  protected async options(endpoint: string, options?: Omit<Parameters<typeof this.makeRequest>[2], 'data'>): Promise<APIResponse> {
    return this.makeRequest('OPTIONS', endpoint, options);
  }

  /**
   * Validates an API response against expected status code and content type.
   * @param response - The API response to validate
   * @param expectedStatusCode - The expected HTTP status code
   * @param expectedContentType - Optional expected content type
   */
  protected async validateResponse(response: APIResponse, expectedStatusCode: number, expectedContentType?: string): Promise<void> {
    await ApiHelper.validateResponse(response, expectedStatusCode, expectedContentType);
  }

  /**
   * Logs the response details for debugging purposes.
   * @param response - The API response to log
   * @param testName - The test name for identification
   */
  protected async logResponse(response: APIResponse, testName: string): Promise<void> {
    await ApiHelper.logResponse(response, testName);
  }

  /**
   * Parses the response body as JSON with type safety.
   * @param response - The API response to parse
   * @returns Promise resolving to parsed JSON data of type T
   */
  protected async parseJsonResponse<T>(response: APIResponse): Promise<T> {
    return await ApiHelper.parseJsonResponse<T>(response);
  }

  /**
   * Generates a random string for test data.
   * @param length - The length of the string to generate
   * @returns Random string
   */
  protected generateRandomString(length: number = 10): string {
    return ApiHelper.generateRandomString(length);
  }

  /**
   * Generates a random number within the specified range.
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random number
   */
  protected generateRandomNumber(min: number = 1, max: number = 1000000): number {
    return ApiHelper.generateRandomNumber(min, max);
  }

  /**
   * Generates a random email address for testing.
   * @returns Random email address
   */
  protected generateRandomEmail(): string {
    return ApiHelper.generateRandomEmail();
  }

  /**
   * Generates a random phone number for testing.
   * @returns Random phone number in US format
   */
  protected generateRandomPhone(): string {
    return ApiHelper.generateRandomPhone();
  }
}
