import { User } from '@domain/user/entities/user.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

export const IUSER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  findById(id: UniqueId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findAll(limit: number, offset: number): Promise<{ users: User[], total: number }>;
  delete(id: UniqueId): Promise<void>;
}



