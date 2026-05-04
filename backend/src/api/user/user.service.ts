import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@/common/abstractions/user.repository.interface';
import { User } from './entities/user.entity';
import { Role } from '@/common/types/role.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(email: string, passwordHash: string, role: Role = Role.USER): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = User.create({ email, passwordHash, role });
    await this.userRepository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
