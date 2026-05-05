import { ErrorDetailDto } from './error-detail.dto';

export class ErrorDto {
  timestamp: string;
  statusCode: number;
  error: string;
  message_code: string;
  message?: string;
  details?: ErrorDetailDto[];
  stack?: string;
  trace?: any;
}
