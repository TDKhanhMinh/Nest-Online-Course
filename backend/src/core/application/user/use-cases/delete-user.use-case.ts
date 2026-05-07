import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const userId = new UniqueId(id);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(userId);
  }
}
