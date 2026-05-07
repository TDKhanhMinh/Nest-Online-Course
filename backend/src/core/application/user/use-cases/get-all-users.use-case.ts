import { Inject, Injectable } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { User } from '@domain/user/entities/user.entity';
import { UserPaginationDto } from '../dto/user-pagination.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: UserPaginationDto): Promise<{ users: User[], total: number }> {
    return this.userRepository.findAll(dto.limit, dto.offset);
  }
}
