export interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  ignoreHTTPSErrors?: boolean;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseURL: process.env.API_BASE_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  ignoreHTTPSErrors: false
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
} as const;

export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
export type StatusCode = typeof STATUS_CODES[keyof typeof STATUS_CODES];
