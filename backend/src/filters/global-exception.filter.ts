import { ErrorDetailDto } from '@/common/dto/error-detail.dto';
import { ErrorDto } from '@/common/dto/error.dto';
import { ErrorCode } from '@/exceptions/error-codes.enum';
import { MessageCode } from '@/exceptions/message-codes.enum';
import { ValidationException } from '@/exceptions/validation.exception';
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { STATUS_CODES } from 'http';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private debug: boolean = false;
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Check if debug mode is enabled (default to false if not configured)
    this.debug = this.configService.get<boolean>('app.debug') ?? false;

    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof ValidationException) {
      error = this.handleValidationException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof MongooseError.CastError) {
      error = this.handleMongoCastError(exception);
    } else if (exception.code === 11000) {
      error = this.handleMongoDuplicateKeyError(exception);
    } else {
      error = this.handleError(exception);
    }

    if (this.debug) {
      error.stack = exception.stack;
      error.trace = exception;

      this.logger.debug(error);
    }

    response.status(error.statusCode).json(error);
  }

  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ): ErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] || 'Unprocessable Entity',
      message_code: MessageCode.VALIDATION_ERROR,
      details: this.extractValidationErrorDetails(r.message),
    };

    this.logger.debug(exception);

    return errorRes;
  }

  private handleValidationException(exception: ValidationException): ErrorDto {
    const r = exception.getResponse() as {
      errorCode: ErrorCode;
      message: string;
    };
    const statusCode = exception.getStatus();

    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] || 'Bad Request',
      message_code:
        Object.keys(ErrorCode).find(key => ErrorCode[key] === r.errorCode) ||
        MessageCode.BAD_REQUEST,
    };

    this.logger.debug(exception);

    return errorRes;
  }

  private handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract the human-readable message from the exception
    let message: string | undefined;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const res = exceptionResponse as Record<string, any>;
      if (typeof res.message === 'string') {
        message = res.message;
      } else if (Array.isArray(res.message)) {
        message = res.message.join(', ');
      }
    }

    // Map HTTP status to message code
    let messageCode: string;
    switch (statusCode) {
      case HttpStatus.UNAUTHORIZED:
        messageCode = MessageCode.UNAUTHORIZED;
        break;
      case HttpStatus.FORBIDDEN:
        messageCode = MessageCode.FORBIDDEN;
        break;
      case HttpStatus.NOT_FOUND:
        messageCode = MessageCode.NOT_FOUND;
        break;
      case HttpStatus.CONFLICT:
        messageCode = MessageCode.CONFLICT;
        break;
      default:
        messageCode = MessageCode.BAD_REQUEST;
    }

    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] || 'Error',
      message_code: messageCode,
      message,
    };

    this.logger.debug(exception);

    return errorRes;
  }

  private handleMongoCastError(error: MongooseError.CastError): ErrorDto {
    const status = HttpStatus.BAD_REQUEST;
    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status] || 'Bad Request',
      message_code: MessageCode.INVALID_OBJECT_ID,
    };

    this.logger.debug(error);

    return errorRes;
  }

  private handleMongoDuplicateKeyError(error: any): ErrorDto {
    const status = HttpStatus.CONFLICT;
    const keyValue = error.keyValue
      ? Object.entries(error.keyValue)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
      : 'unknown';

    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status] || 'Conflict',
      message_code: MessageCode.DUPLICATE_KEY,
      message: `Duplicate value for ${keyValue}`,
    };

    this.logger.error(error);

    return errorRes;
  }

  private handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode] || 'Internal Server Error',
      message_code: MessageCode.INTERNAL_SERVER_ERROR,
    };

    this.logger.error(error);

    return errorRes;
  }

  private extractValidationErrorDetails(
    errors: ValidationError[],
  ): ErrorDetailDto[] {
    const extractErrors = (
      error: ValidationError,
      parentProperty: string = '',
    ): ErrorDetailDto[] => {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: ErrorDetailDto[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property: propertyPath,
        code,
        message,
      }));

      const childErrors: ErrorDetailDto[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, propertyPath),
        ) || [];

      return [...currentErrors, ...childErrors];
    };

    return errors.flatMap((error) => extractErrors(error));
  }
}
