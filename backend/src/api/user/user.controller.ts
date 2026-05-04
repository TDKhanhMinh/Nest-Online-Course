import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    const userProfile = await this.userService.findById(user.sub);
    return {
      id: userProfile.id.value,
      email: userProfile.email,
      role: userProfile.role,
    };
  }
}
