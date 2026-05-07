import { Controller, Get, UseGuards, Query, Patch, Param, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@presentation/web/shared/decorators/current-user.decorator';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';
import { Roles } from '@presentation/web/shared/decorators/roles.decorator';
import { Role } from '@shared/types/role.enum';
import { UserPaginationDto } from '@application/user/dto/user-pagination.dto';
import { UpdateUserDto } from '@application/user/dto/update-user.dto';

import { GetUserByIdUseCase } from '@application/user/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from '@application/user/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '@application/user/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@application/user/use-cases/delete-user.use-case';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    const userProfile = await this.getUserByIdUseCase.execute(user.sub);
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
    const { users, total } = await this.getAllUsersUseCase.execute(pagination);
    return {
      users: users.map((u) => ({
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
    const user = await this.updateUserUseCase.execute(id, updateData);
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
    await this.deleteUserUseCase.execute(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
