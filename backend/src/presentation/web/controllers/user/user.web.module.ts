import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { InstructorProfileController } from './instructor-profile.controller';
import { UserApplicationModule } from '@application/user/user.application.module';

@Module({
  imports: [UserApplicationModule],
  controllers: [UserController, InstructorProfileController],
})
export class UserWebModule {}
