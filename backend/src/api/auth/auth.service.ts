import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/api/user/user.service';
import { InstructorProfileService } from '@/api/user/instructor-profile.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterInstructorDto } from './dto/register-instructor.dto';
import { JwtPayload } from '@/decorators/current-user.decorator';
import { Role } from '@/common/types/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly instructorProfileService: InstructorProfileService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.userService.createUser(
      registerDto.fullName,
      registerDto.email,
      passwordHash,
      registerDto.role ? [registerDto.role] : [Role.STUDENT],
    );

    return this.buildAuthResponse(
      user.id.value,
      user.fullName,
      user.email,
      user.roles,
    );
  }

  async registerInstructor(dto: RegisterInstructorDto) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // 1. Create user with INSTRUCTOR role
    const user = await this.userService.createUser(
      dto.fullName,
      dto.email,
      passwordHash,
      [Role.INSTRUCTOR],
    );

    // 2. Create instructor profile
    const profile = await this.instructorProfileService.createProfile(
      user.id.value,
      {
        biography: dto.biography,
        headline: dto.headline,
        website: dto.website,
        twitter: dto.twitter,
        linkedin: dto.linkedin,
        youtube: dto.youtube,
      },
    );

    return {
      ...this.buildAuthResponse(
        user.id.value,
        user.fullName,
        user.email,
        user.roles,
      ),
      profile: {
        headline: profile.headline,
        biography: profile.biography,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(
      user.id.value,
      user.fullName,
      user.email,
      user.roles,
    );
  }

  private buildAuthResponse(
    id: string,
    fullName: string,
    email: string,
    roles: Role[],
  ) {
    const payload: JwtPayload = { sub: id, email, roles };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id,
        fullName,
        email,
        roles,
      },
    };
  }
}
