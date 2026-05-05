export interface ErrorDetail {
  property: string;
  code: string;
  message: string;
}

export class ApiSuccessResponse<T = any> {
  statusCode: number;
  message_code: string;
  data: T;
  timestamp: string;

  constructor(payload: any) {
    this.statusCode = payload.statusCode;
    this.message_code = payload.message_code;
    this.data = payload.data;
    this.timestamp = payload.timestamp;
  }

  get isSuccess(): boolean {
    return true;
  }
}

export class ApiErrorResponse extends Error {
  statusCode: number;
  error: string;
  message_code: string;
  details?: ErrorDetail[];
  timestamp: string;

  constructor(payload: any) {
    super(payload.message || payload.error || 'Unknown API Error');
    this.name = 'ApiErrorResponse';
    this.statusCode = payload.statusCode;
    this.error = payload.error;
    this.message_code = payload.message_code;
    this.details = payload.details;
    this.timestamp = payload.timestamp;
  }

  get isSuccess(): boolean {
    return false;
  }
}
