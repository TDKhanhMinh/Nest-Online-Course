import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '@/infrastructure/shared-kernel/domain-exception.base';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusMap: Record<string, HttpStatus> = {
      COURSE_NOT_FOUND: HttpStatus.NOT_FOUND,
      LESSON_NOT_FOUND: HttpStatus.NOT_FOUND,
      NOT_ENROLLED: HttpStatus.FORBIDDEN,
      ALREADY_ENROLLED: HttpStatus.CONFLICT,
      CERTIFICATE_ALREADY_ISSUED: HttpStatus.CONFLICT,
      LESSON_ALREADY_COMPLETED: HttpStatus.CONFLICT,
    };

    const status = statusMap[exception.code] ?? HttpStatus.BAD_REQUEST;

    this.logger.warn(`DomainException [${exception.code}]: ${exception.message}`);

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
