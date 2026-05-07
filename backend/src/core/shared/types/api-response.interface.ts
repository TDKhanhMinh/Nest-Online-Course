export interface ApiResponse<T> {
  statusCode: number;
  message_code: string;
  data: T;
  timestamp: string;
}



