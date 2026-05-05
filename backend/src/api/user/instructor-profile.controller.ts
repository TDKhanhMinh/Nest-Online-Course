import { Controller, Post, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { InstructorProfileService } from './instructor-profile.service';
import { CreateInstructorProfileDto, UpdateInstructorProfileDto } from './dto/instructor-profile.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { Role } from '@/common/types/role.enum';

@Controller('instructor-profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorProfileController {
  constructor(private readonly profileService: InstructorProfileService) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateInstructorProfileDto) {
    return this.profileService.createProfile(req.user.id, dto);
  }

  @Get('me')
  async getMyProfile(@Req() req: any) {
    return this.profileService.getProfileByUserId(req.user.id);
  }

  @Put('me')
  async updateMyProfile(@Req() req: any, @Body() dto: UpdateInstructorProfileDto) {
    return this.profileService.updateProfile(req.user.id, dto);
  }
}
