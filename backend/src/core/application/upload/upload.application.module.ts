import { Module } from '@nestjs/common';
import { UploadFileUseCase } from './use-cases/upload-file.use-case';

const useCases = [UploadFileUseCase];

@Module({
  providers: [...useCases],
  exports: [...useCases],
})
export class UploadApplicationModule {}
