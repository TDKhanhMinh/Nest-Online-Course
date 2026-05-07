export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export const IPASSWORD_HASHER = Symbol('IPasswordHasher');
