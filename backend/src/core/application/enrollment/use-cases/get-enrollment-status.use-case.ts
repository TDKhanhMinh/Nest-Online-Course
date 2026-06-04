import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository, IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { ICartRepository, ICART_REPOSITORY } from '@domain/cart/ports/i-cart.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface EnrollmentStatusDto {
  enrolled: boolean;
  inCart: boolean;
  progress?: number;
  enrollmentId?: string;
}

@Injectable()
export class GetEnrollmentStatusUseCase {
  constructor(
    @Inject(IENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    @Inject(ICART_REPOSITORY)
    private readonly cartRepo: ICartRepository,
  ) {}

  async execute(studentId: string, courseId: string): Promise<EnrollmentStatusDto> {
    const studentUid = new UniqueId(studentId);
    const courseUid = new UniqueId(courseId);

    const enrollment = await this.enrollmentRepo.findByStudentAndCourse(studentUid, courseUid);

    const cart = await this.cartRepo.findByStudentId(studentUid);
    const inCart = cart
      ? cart.courseIds.some(id => id.equals(courseUid))
      : false;

    return {
      enrolled: !!enrollment,
      inCart,
      progress: enrollment?.progress,
      enrollmentId: enrollment?.id.value,
    };
  }
}
