import { Role } from '@shared/types/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}

export interface ITokenService {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload;
}

export const ITOKEN_SERVICE = Symbol('ITokenService');
