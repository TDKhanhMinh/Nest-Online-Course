import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IInstructorProfileRepository } from '@/common/abstractions/repositories/i-instructor-profile.repository';
import { IUserRepository } from '@/common/abstractions/repositories/i-user.repository';
import { InstructorProfile } from './entities/instructor-profile.entity';
import { CreateInstructorProfileDto, UpdateInstructorProfileDto } from './dto/instructor-profile.dto';
import { Role } from '@/common/types/role.enum';
import { UniqueId } from '@/common/types/unique-id.vo';

@Injectable()
export class InstructorProfileService {
  constructor(
    @Inject(IInstructorProfileRepository)
    private readonly profileRepository: IInstructorProfileRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) { }

  async createProfile(userId: string, dto: CreateInstructorProfileDto): Promise<InstructorProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new ConflictException('Instructor profile already exists for this user');
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

  async getProfileByUserId(userId: string): Promise<InstructorProfile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Instructor profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateInstructorProfileDto): Promise<InstructorProfile> {
    const profile = await this.getProfileByUserId(userId);

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
