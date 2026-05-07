import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { LoginDto } from '../dto/login.dto';
import { IPasswordHasher, IPASSWORD_HASHER } from '../ports/i-password-hasher';
import { ITokenService, ITOKEN_SERVICE } from '../ports/i-token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(IPASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ITOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
