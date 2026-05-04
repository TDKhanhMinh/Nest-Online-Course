import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;
    
    const additionalData =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)
        : {};

    // Handle NestJS Validation Errors (class-validator)
    let messageCode = errorMessage.toUpperCase().replace(/\s+/g, '_');
    let data: any = additionalData;

    if (httpStatus === HttpStatus.BAD_REQUEST && Array.isArray(additionalData['message'])) {
      messageCode = 'VALIDATION_ERROR';
      data = {
        errors: additionalData['message'],
      };
    } else {
      // Clean up data by removing redundant fields
      const { statusCode: _, message: __, error: ___, ...rest } = additionalData;
      data = Object.keys(rest).length > 0 ? rest : {};
    }

    const responseBody = {
      statusCode: httpStatus,
      message_code: messageCode,
      data: data,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof Error) {
      this.logger.error(`[${httpStatus}] ${exception.message}`, exception.stack);
    } else {
      this.logger.error(`[${httpStatus}] Unknown Error`, exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
