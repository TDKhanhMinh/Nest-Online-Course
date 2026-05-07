import { Injectable } from '@nestjs/common';
import { IPasswordHasher } from '@application/auth/ports/i-password-hasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
