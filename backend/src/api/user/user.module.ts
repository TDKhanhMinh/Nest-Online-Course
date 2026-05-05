import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/database/schemas/user.schema';
import { InstructorProfileDocument, InstructorProfileSchema } from '@/database/schemas/instructor-profile.schema';
import { IUserRepository } from '@/common/abstractions/repositories/i-user.repository';
import { IInstructorProfileRepository } from '@/common/abstractions/repositories/i-instructor-profile.repository';
import { UserRepository } from './user.repository';
import { InstructorProfileRepository } from './instructor-profile.repository';
import { InstructorProfileMapper } from './instructor-profile.mapper';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InstructorProfileService } from './instructor-profile.service';
import { InstructorProfileController } from './instructor-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: InstructorProfileDocument.name, schema: InstructorProfileSchema },
    ]),
  ],
  controllers: [UserController, InstructorProfileController],
  providers: [
    UserService,
    InstructorProfileService,
    InstructorProfileMapper,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IInstructorProfileRepository,
      useClass: InstructorProfileRepository,
    },
  ],
  exports: [UserService, InstructorProfileService, IUserRepository, IInstructorProfileRepository],
})
export class UserModule {}
