import { Injectable, Inject } from '@nestjs/common';
import { IINSTRUCTOR_PROFILE_REPOSITORY, IInstructorProfileRepository } from '@domain/user/ports/i-instructor-profile.repository';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { InstructorProfile } from '@domain/user/entities/instructor-profile.entity';
import { CreateInstructorProfileDto } from '../dto/instructor-profile.dto';
import { Role } from '@shared/types/role.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { DomainException } from '@/exceptions/domain-exception.base';
import { ErrorCode } from '@/exceptions/error-codes.enum';

@Injectable()
export class CreateInstructorProfileUseCase {
  constructor(
    @Inject(IINSTRUCTOR_PROFILE_REPOSITORY)
    private readonly profileRepository: IInstructorProfileRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: CreateInstructorProfileDto): Promise<InstructorProfile> {
    const user = await this.userRepository.findById(new UniqueId(userId));
    if (!user) {
      throw new DomainException(ErrorCode.USER_NOT_FOUND, 'User not found');
    }

    const existingProfile = await this.profileRepository.findByUserId(new UniqueId(userId));
    if (existingProfile) {
      throw new DomainException(ErrorCode.PROFILE_EXISTS, 'Instructor profile already exists for this user');
    }

    const profile = InstructorProfile.create({
      userId: user.id,
      headline: dto.headline,
      biography: dto.biography,
      website: dto.website,
      twitter: dto.twitter,
      linkedin: dto.linkedin,
      youtube: dto.youtube,
    });

    await this.profileRepository.save(profile);

    // Update user roles if not already an instructor
    if (!user.roles.includes(Role.INSTRUCTOR)) {
      user.updateRoles([...user.roles, Role.INSTRUCTOR]);
      await this.userRepository.save(user);
    }

    return profile;
  }
}
