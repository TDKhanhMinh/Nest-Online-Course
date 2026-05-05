import { Controller, Get, UseGuards, Query, Patch, Param, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/decorators/current-user.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/common/types/role.enum';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    const userProfile = await this.userService.findById(user.sub);
    return {
      id: userProfile.id.value,
      fullName: userProfile.fullName,
      email: userProfile.email,
      roles: userProfile.roles,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers(@Query() pagination: UserPaginationDto) {
    const { users, total } = await this.userService.findAll(pagination.limit, pagination.offset);
    return {
      users: users.map(u => ({
        id: u.id.value,
        fullName: u.fullName,
        email: u.email,
        roles: u.roles,
      })),
      total,
      limit: pagination.limit,
      offset: pagination.offset,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    const user = await this.userService.updateUser(id, updateData);
    return {
      id: user.id.value,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
