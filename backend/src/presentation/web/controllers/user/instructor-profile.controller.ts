import { Controller, Post, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { CreateInstructorProfileDto, UpdateInstructorProfileDto } from '@application/user/dto/instructor-profile.dto';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@presentation/web/shared/guards/roles.guard';

import { CreateInstructorProfileUseCase } from '@application/user/use-cases/create-instructor-profile.use-case';
import { GetInstructorProfileUseCase } from '@application/user/use-cases/get-instructor-profile.use-case';
import { UpdateInstructorProfileUseCase } from '@application/user/use-cases/update-instructor-profile.use-case';

@Controller({
  path: 'instructor-profiles',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorProfileController {
  constructor(
    private readonly createInstructorProfileUseCase: CreateInstructorProfileUseCase,
    private readonly getInstructorProfileUseCase: GetInstructorProfileUseCase,
    private readonly updateInstructorProfileUseCase: UpdateInstructorProfileUseCase,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateInstructorProfileDto) {
    return this.createInstructorProfileUseCase.execute(req.user.id, dto);
  }

  @Post('register')
  async register(@Req() req: any, @Body() dto: CreateInstructorProfileDto) {
    return this.createInstructorProfileUseCase.execute(req.user.id, dto);
  }

  @Get('me')
  async getMyProfile(@Req() req: any) {
    return this.getInstructorProfileUseCase.execute(req.user.id);
  }

  @Put('me')
  async updateMyProfile(@Req() req: any, @Body() dto: UpdateInstructorProfileDto) {
    return this.updateInstructorProfileUseCase.execute(req.user.id, dto);
  }
}
