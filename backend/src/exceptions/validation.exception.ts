import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes.enum';

export class ValidationException extends HttpException {
  constructor(public readonly errorCode: ErrorCode, message: string) {
    super({ errorCode, message }, HttpStatus.BAD_REQUEST);
  }
}



