import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentRepository, IENROLLMENT_REPOSITORY } from '@domain/enrollment/ports/i-enrollment.repository';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ICategoryRepository, ICATEGORY_REPOSITORY } from '@domain/course/ports/i-category.repository';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { UniqueId } from '@shared/types/unique-id.vo';

export interface MyEnrollmentDto {
  enrollmentId: string;
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  price: number;
  instructorName: string;
  categoryName: string;
  progress: number;
  status: string;
  enrolledAt: Date;
  completedAt?: Date;
}

@Injectable()
export class GetStudentEnrollmentsUseCase {
  constructor(
    @Inject(IENROLLMENT_REPOSITORY)
    private readonly enrollmentRepo: IEnrollmentRepository,

    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,

    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,

    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(studentId: string): Promise<MyEnrollmentDto[]> {
    const studentUid = new UniqueId(studentId);
    const enrollments = await this.enrollmentRepo.findAllByStudent(studentUid);

    const results: MyEnrollmentDto[] = [];

    for (const enrollment of enrollments) {
      const course = await this.courseRepo.findById(enrollment.courseId);
      if (!course) continue;

      const [instructor, category] = await Promise.all([
        this.userRepo.findById(course.instructorId),
        this.categoryRepo.findById(course.categoryId),
      ]);

      results.push({
        enrollmentId: enrollment.id.value,
        courseId: enrollment.courseId.value,
        title: course.title.value,
        slug: course.slug,
        thumbnailUrl: course.thumbnailUrl,
        price: course.price,
        instructorName: instructor?.fullName || 'Unknown Instructor',
        categoryName: category?.name || 'Uncategorized',
        progress: enrollment.progress,
        status: enrollment.status.value,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      });
    }

    return results;
  }
}
