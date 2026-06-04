import { Module } from '@nestjs/common';
import { EnrollStudentUseCase } from './use-cases/enroll-student.use-case';
import { GetStudentEnrollmentsUseCase } from './use-cases/get-student-enrollments.use-case';
import { GetEnrollmentStatusUseCase } from './use-cases/get-enrollment-status.use-case';
import { OnOrderSuccessHandler } from './events/on-order-success.handler';

const useCases = [
  EnrollStudentUseCase,
  GetStudentEnrollmentsUseCase,
  GetEnrollmentStatusUseCase,
];

@Module({
  providers: [...useCases, OnOrderSuccessHandler],
  exports: [...useCases],
})
export class EnrollmentApplicationModule {}
