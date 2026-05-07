import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { User } from '@domain/user/entities/user.entity';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(new UniqueId(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
