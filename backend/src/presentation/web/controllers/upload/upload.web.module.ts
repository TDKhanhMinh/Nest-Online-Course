import { Module } from '@nestjs/common';
import { UploadApplicationModule } from '@application/upload/upload.application.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [UploadApplicationModule],
  controllers: [UploadController],
})
export class UploadWebModule {}
