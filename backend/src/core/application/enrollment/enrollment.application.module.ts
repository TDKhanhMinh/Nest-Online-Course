import { Module } from '@nestjs/common';
import { EnrollStudentUseCase } from './use-cases/enroll-student.use-case';
import { OnOrderSuccessHandler } from './events/on-order-success.handler';

const useCases = [EnrollStudentUseCase];

@Module({
  providers: [...useCases, OnOrderSuccessHandler],
  exports: [...useCases],
})
export class EnrollmentApplicationModule {}
