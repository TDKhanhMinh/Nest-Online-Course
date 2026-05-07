import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { StudentFeaturesApplicationModule } from '@application/student-features/student-features.application.module';

@Module({
  imports: [StudentFeaturesApplicationModule],
  controllers: [WishlistController],
})
export class StudentFeaturesWebModule {}
