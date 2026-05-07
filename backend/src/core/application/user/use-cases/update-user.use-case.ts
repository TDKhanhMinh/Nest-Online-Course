import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { User } from '@domain/user/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(new UniqueId(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      user.updateEmail(dto.email);
    }

    if (dto.roles) {
      user.updateRoles(dto.roles);
    }

    if (dto.fullName) {
      user.props.fullName = dto.fullName;
    }

    await this.userRepository.save(user);
    return user;
  }
}
