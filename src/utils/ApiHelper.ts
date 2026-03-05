import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { STATUS_CODES } from '@/config/api-config';

export class ApiHelper {
  private static requestContext: APIRequestContext | null = null;

  public static async setRequestContext(context: APIRequestContext): Promise<void> {
    this.requestContext = context;
  }

  public static getRequestContext(): APIRequestContext {
    if (!this.requestContext) {
      throw new Error('Request context not initialized. Call setRequestContext first.');
    }
    return this.requestContext;
  }

  public static async closeRequestContext(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = null;
    }
  }

  public static async validateResponse(
    response: APIResponse,
    expectedStatusCode: number,
    expectedContentType?: string
  ): Promise<void> {
    expect(response.status()).toBe(expectedStatusCode);
    
    if (expectedContentType) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain(expectedContentType);
    }
  }

  public static async logResponse(response: APIResponse, testName: string): Promise<void> {
    const responseStatus = response.status();
    const responseHeaders = response.headers();
    const responseText = await response.text();
    
    console.log(`\n=== ${testName} Response ===`);
    console.log(`Status: ${responseStatus}`);
    console.log(`Headers: ${JSON.stringify(responseHeaders, null, 2)}`);
    console.log(`Body: ${responseText}`);
    console.log('========================\n');
  }

  public static async logCurlCommand(
    requestContext: APIRequestContext,
    endpoint: string,
    method: string,
    requestData: any
  ): Promise<void> {
    const baseURL = (requestContext as any)._options?.baseURL || '';
    const fullUrl = baseURL + endpoint;
    const headers = requestData.headers || {};
    
    let curlCommand = `curl -X ${method} '${fullUrl}'`;
    
    for (const [key, value] of Object.entries(headers)) {
      curlCommand += ` -H '${key}: ${value}'`;
    }
    
    if (requestData.data) {
      curlCommand += ` -d '${JSON.stringify(requestData.data)}'`;
    }
    
    if (requestData.params) {
      const params = new URLSearchParams(requestData.params).toString();
      curlCommand += `'${fullUrl}?${params}'`;
    }
    
    console.log(`Curl Command: ${curlCommand}`);
  }

  public static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public static generateRandomNumber(min: number = 1, max: number = 1000000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static generateRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'test.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const username = this.generateRandomString(8).toLowerCase();
    return `${username}@${domain}`;
  }

  public static generateRandomPhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }

  public static async parseJsonResponse<T>(response: APIResponse): Promise<T> {
    const responseText = await response.text();
    try {
      return JSON.parse(responseText) as T;
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${responseText}`);
    }
  }

  public static async validateJsonSchema(
    response: APIResponse,
    expectedSchema: any
  ): Promise<void> {
    const responseData = await this.parseJsonResponse(response);
    expect(responseData).toMatchObject(expectedSchema);
  }

  public static async validateResponseTime(
    response: APIResponse,
    maxResponseTime: number = 5000
  ): Promise<void> {
    const responseTime = await this.getResponseTime(response);
    expect(responseTime).toBeLessThan(maxResponseTime);
  }

  private static async getResponseTime(response: APIResponse): Promise<number> {
    const headers = response.headers();
    const serverTiming = headers['server-timing'] || headers['x-response-time'];
    
    if (serverTiming) {
      const match = serverTiming.match(/dur=(\d+)/);
      if (match) {
        return parseInt(match[1]);
      }
    }
    
    return 0;
  }

  public static createFormData(data: Record<string, any>): Record<string, string> {
    const formData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        formData[key] = String(value);
      }
    }
    return formData;
  }

  public static createMultipartData(data: Record<string, any>): Record<string, any> {
    const multipartData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        multipartData[key] = value;
      }
    }
    return multipartData;
  }

  public static async retryRequest(
    requestFn: () => Promise<APIResponse>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<APIResponse> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await requestFn();
        if (response.status() >= 200 && response.status() < 500) {
          return response;
        }
        lastError = new Error(`Request failed with status ${response.status()}`);
      } catch (error) {
        lastError = error as Error;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error('Request failed after retries');
  }

  public static async extractErrorMessage(response: APIResponse): Promise<string> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        const errorData = JSON.parse(await response.text());
        return errorData.message || errorData.error || JSON.stringify(errorData);
      } catch {
        return await response.text();
      }
    }
    
    return await response.text();
  }
}
