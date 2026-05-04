import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/database/schemas/user.schema';
import { IUserRepository } from '@/common/abstractions/user.repository.interface';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
