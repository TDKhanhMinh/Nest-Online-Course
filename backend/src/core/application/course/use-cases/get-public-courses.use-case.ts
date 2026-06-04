import { Inject, Injectable } from '@nestjs/common';
import { ICourseRepository, ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ICategoryRepository, ICATEGORY_REPOSITORY } from '@domain/course/ports/i-category.repository';
import { IUserRepository, IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { PublicCourseQueryDto } from '../dto/public-course-query.dto';
import { PublicCourseDto } from '../dto/public-course-response.dto';
import { CourseStatus } from '@shared/types/course-status.enum';
import { PageDto } from '@shared/pagination/offset/page.dto';

@Injectable()
export class GetPublicCoursesUseCase {
  constructor(
    @Inject(ICOURSE_REPOSITORY)
    private readonly courseRepo: ICourseRepository,
    @Inject(ICATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(query: PublicCourseQueryDto): Promise<PageDto<PublicCourseDto>> {
    const extraFilter: any = { status: CourseStatus.PUBLISHED };

    if (query.category) {
      const category = await this.categoryRepo.findByNameOrSlug(query.category);
      if (category) {
        extraFilter.categoryId = category.id.value;
      } else {
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query.category);
        if (isObjectId) {
          extraFilter.categoryId = query.category;
        } else {
          // If a category name was searched but not found in DB, force query to return no results
          extraFilter.categoryId = '000000000000000000000000';
        }
      }
    }

    if (query.level) {
      extraFilter.level = query.level.toUpperCase();
    }

    let sort: any = { createdAt: -1 };
    if (query.sortBy) {
      switch (query.sortBy) {
        case 'latest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'rating_desc':
          sort = { averageRating: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const paginatedResult = await this.courseRepo.findAllWithOffset(query, extraFilter, sort);

    const mappedCourses = await Promise.all(
      paginatedResult.data.map(async (course) => {
        const [instructor, category] = await Promise.all([
          this.userRepo.findById(course.instructorId),
          this.categoryRepo.findById(course.categoryId),
        ]);

        return {
          id: course.id.value,
          title: course.title.value,
          slug: course.slug,
          description: course.description,
          price: course.price,
          level: course.level,
          language: course.language,
          thumbnailUrl: course.thumbnailUrl,
          instructorId: course.instructorId.value,
          instructorName: instructor?.fullName || 'Unknown Instructor',
          categoryId: course.categoryId.value,
          categoryName: category?.name || 'Uncategorized',
          avgRating: course.averageRating || 4.5,
          totalReviews: course.totalReview || 0,
          totalStudents: course.totalEnrolled || 0,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          author: instructor?.fullName || 'Unknown Instructor',
          category: category?.name || 'Uncategorized',
        };
      }),
    );

    return new PageDto(mappedCourses, paginatedResult.pagination);
  }
}
