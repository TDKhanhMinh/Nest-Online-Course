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
  override message: string;

  constructor(payload: any) {
    // Handle cases where the payload might be nested or in different formats
    const data = payload?.response || payload || {};
    
    let finalMessage = 'Unknown API Error';
    
    if (Array.isArray(data.message)) {
      finalMessage = data.message.join(', ');
    } else if (typeof data.message === 'string') {
      finalMessage = data.message;
    } else if (typeof data.error === 'string') {
      finalMessage = data.error;
    } else if (typeof payload === 'string') {
      finalMessage = payload;
    }

    super(finalMessage);
    this.name = 'ApiErrorResponse';
    this.message = finalMessage;
    this.statusCode = data.statusCode || payload?.status || 500;
    this.error = data.error || 'Error';
    this.message_code = data.message_code || 'API_ERROR';
    this.timestamp = data.timestamp || new Date().toISOString();
    
    // If we have an array of messages, we can also populate details for more granular display
    if (Array.isArray(data.message) && !data.details) {
      this.details = data.message.map((msg: any) => ({
        property: 'validation',
        code: 'invalid',
        message: typeof msg === 'string' ? msg : JSON.stringify(msg)
      }));
    } else {
      this.details = data.details;
    }
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiErrorResponse);
    }
  }

  get isSuccess(): boolean {
    return false;
  }
}
