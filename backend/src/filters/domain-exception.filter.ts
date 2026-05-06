import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<ErrorCode, HttpStatus> = {
      [ErrorCode.COURSE_NOT_FOUND]: HttpStatus.NOT_FOUND,
      [ErrorCode.LESSON_NOT_FOUND]: HttpStatus.NOT_FOUND,
      [ErrorCode.NOT_ENROLLED]: HttpStatus.FORBIDDEN,
      [ErrorCode.ALREADY_ENROLLED]: HttpStatus.CONFLICT,
      [ErrorCode.CERTIFICATE_ALREADY_ISSUED]: HttpStatus.CONFLICT,
      [ErrorCode.LESSON_ALREADY_COMPLETED]: HttpStatus.CONFLICT,
      [ErrorCode.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
      [ErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
      [ErrorCode.CATEGORY_NOT_FOUND]: HttpStatus.NOT_FOUND,
      [ErrorCode.COURSE_ALREADY_EXISTS]: HttpStatus.CONFLICT,
      [ErrorCode.COURSE_HAS_CONTENT]: HttpStatus.BAD_REQUEST,
    };

    const status = statusMap[exception.code] ?? HttpStatus.BAD_REQUEST;

    this.logger.warn(`DomainException [${exception.code}]: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      message_code: exception.code,
      data: {
        message: exception.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
