import { Injectable, Inject } from '@nestjs/common';
import { IINSTRUCTOR_PROFILE_REPOSITORY, IInstructorProfileRepository } from '@domain/user/ports/i-instructor-profile.repository';
import { InstructorProfile } from '@domain/user/entities/instructor-profile.entity';
import { UpdateInstructorProfileDto } from '../dto/instructor-profile.dto';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

@Injectable()
export class UpdateInstructorProfileUseCase {
  constructor(
    @Inject(IINSTRUCTOR_PROFILE_REPOSITORY)
    private readonly profileRepository: IInstructorProfileRepository,
  ) {}

  async execute(userId: string, dto: UpdateInstructorProfileDto): Promise<InstructorProfile> {
    const profile = await this.profileRepository.findByUserId(new UniqueId(userId));
    
    if (!profile) {
      throw new DomainException(ErrorCode.PROFILE_NOT_FOUND, 'Instructor profile not found');
    }

    if (dto.biography !== undefined) profile.props.biography = dto.biography;
    if (dto.headline !== undefined) profile.props.headline = dto.headline;
    if (dto.website !== undefined) profile.props.website = dto.website;
    if (dto.twitter !== undefined) profile.props.twitter = dto.twitter;
    if (dto.linkedin !== undefined) profile.props.linkedin = dto.linkedin;
    if (dto.youtube !== undefined) profile.props.youtube = dto.youtube;

    await this.profileRepository.save(profile);
    return profile;
  }
}
