import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { User } from '@domain/user/entities/user.entity';
import { Role } from '@shared/types/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = User.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash: dto.passwordHash,
      roles: dto.roles || [Role.STUDENT],
    });

    await this.userRepository.save(user);
    return user;
  }
}
