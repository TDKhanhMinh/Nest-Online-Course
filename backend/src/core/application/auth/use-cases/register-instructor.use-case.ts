import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { IINSTRUCTOR_PROFILE_REPOSITORY, IInstructorProfileRepository } from '@domain/user/ports/i-instructor-profile.repository';
import { User } from '@domain/user/entities/user.entity';
import { InstructorProfile } from '@domain/user/entities/instructor-profile.entity';
import { Role } from '@shared/types/role.enum';
import { RegisterInstructorDto } from '../dto/register-instructor.dto';
import { IPasswordHasher, IPASSWORD_HASHER } from '../ports/i-password-hasher';
import { ITokenService, ITOKEN_SERVICE } from '../ports/i-token.service';

@Injectable()
export class RegisterInstructorUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(IINSTRUCTOR_PROFILE_REPOSITORY)
    private readonly instructorProfileRepository: IInstructorProfileRepository,
    @Inject(IPASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ITOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: RegisterInstructorDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    // 1. Create user with INSTRUCTOR role
    const user = User.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      roles: [Role.INSTRUCTOR],
    });

    await this.userRepository.save(user);

    // 2. Create instructor profile
    const profile = InstructorProfile.create({
      userId: user.id,
      headline: dto.headline,
      biography: dto.biography,
      website: dto.website,
      twitter: dto.twitter,
      linkedin: dto.linkedin,
      youtube: dto.youtube,
    });

    await this.instructorProfileRepository.save(profile);

    const accessToken = this.tokenService.generateToken({
      sub: user.id.value,
      email: user.email,
      roles: user.roles,
    });

    return {
      accessToken,
      user: {
        id: user.id.value,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      },
      profile: {
        headline: profile.headline,
        biography: profile.biography,
      },
    };
  }
}
