export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorDetail {
  field?: string;
  code: string;
  message: string;
  value?: any;
}

export interface ValidationErrorResponse extends ApiResponse<null> {
  error: {
    code: string;
    message: string;
    details: ErrorDetail[];
  };
}

export interface BaseResource {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResourceWithTimestamps extends BaseResource {
  createdAt: string;
  updatedAt: string;
}

export interface ResourceWithSoftDelete extends BaseResource {
  deletedAt?: string;
  isDeleted: boolean;
}
