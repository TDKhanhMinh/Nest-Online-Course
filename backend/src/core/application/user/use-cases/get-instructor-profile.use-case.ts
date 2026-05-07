import { Injectable, Inject } from '@nestjs/common';
import { IINSTRUCTOR_PROFILE_REPOSITORY, IInstructorProfileRepository } from '@domain/user/ports/i-instructor-profile.repository';
import { InstructorProfile } from '@domain/user/entities/instructor-profile.entity';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

@Injectable()
export class GetInstructorProfileUseCase {
  constructor(
    @Inject(IINSTRUCTOR_PROFILE_REPOSITORY)
    private readonly profileRepository: IInstructorProfileRepository,
  ) {}

  async execute(userId: string): Promise<InstructorProfile> {
    const profile = await this.profileRepository.findByUserId(new UniqueId(userId));
    if (!profile) {
      throw new DomainException(ErrorCode.PROFILE_NOT_FOUND, 'Instructor profile not found');
    }
    return profile;
  }
}
