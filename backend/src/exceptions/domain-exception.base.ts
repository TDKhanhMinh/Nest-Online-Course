import { ErrorCode } from './error-codes.enum';

export class DomainException extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}
