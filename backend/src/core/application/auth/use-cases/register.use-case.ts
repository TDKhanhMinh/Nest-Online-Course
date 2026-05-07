import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IUSER_REPOSITORY, IUserRepository } from '@domain/user/ports/i-user.repository';
import { User } from '@domain/user/entities/user.entity';
import { Role } from '@shared/types/role.enum';
import { RegisterDto } from '../dto/register.dto';
import { IPasswordHasher, IPASSWORD_HASHER } from '../ports/i-password-hasher';
import { ITokenService, ITOKEN_SERVICE } from '../ports/i-token.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(IPASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ITOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    
    const user = User.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      roles: dto.role ? [dto.role] : [Role.STUDENT],
    });

    await this.userRepository.save(user);

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
    };
  }
}
