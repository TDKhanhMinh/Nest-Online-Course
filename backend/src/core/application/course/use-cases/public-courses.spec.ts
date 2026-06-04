import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetPublicCoursesUseCase } from './get-public-courses.use-case';
import { GetPublicCourseDetailUseCase } from './get-public-course-detail.use-case';
import { GetPublicCourseReviewsUseCase } from './get-public-course-reviews.use-case';
import { ICOURSE_REPOSITORY } from '@domain/course/ports/i-course.repository';
import { ICATEGORY_REPOSITORY } from '@domain/course/ports/i-category.repository';
import { IUSER_REPOSITORY } from '@domain/user/ports/i-user.repository';
import { ISECTION_REPOSITORY } from '@domain/course/ports/i-section.repository';
import { ILESSON_REPOSITORY } from '@domain/course/ports/i-lesson.repository';
import { IREVIEW_REPOSITORY } from '@domain/course/ports/i-review.repository';
import { CourseStatus } from '@shared/types/course-status.enum';
import { CourseLevel } from '@shared/types/course-level.enum';
import { LessonType } from '@shared/types/lesson-type.enum';
import { UniqueId } from '@shared/types/unique-id.vo';
import { Course } from '@domain/course/entities/course.entity';
import { CourseTitle } from '@domain/course/value-objects/course-title.vo';
import { Section } from '@domain/course/entities/section.entity';
import { Lesson } from '@domain/course/entities/lesson.entity';
import { PageDto } from '@shared/pagination/offset/page.dto';
import { PageMetaDto } from '@shared/pagination/offset/page-meta.dto';
import { PublicCourseQueryDto } from '../dto/public-course-query.dto';

describe('Public Courses Use Cases', () => {
  let getPublicCoursesUseCase: GetPublicCoursesUseCase;
  let getPublicCourseDetailUseCase: GetPublicCourseDetailUseCase;

  const mockCourse = Course.reconstitute({
    title: new CourseTitle('Published Course'),
    slug: 'published-course',
    description: 'Description',
    instructorId: UniqueId.generate(),
    categoryId: UniqueId.generate(),
    price: 100,
    level: CourseLevel.BEGINNER,
    language: 'English',
    status: CourseStatus.PUBLISHED,
    totalEnrolled: 0,
    totalReview: 0,
    averageRating: 4.5,
    isPublished: true,
    totalView: 0,
    totalLike: 0,
    totalContent: 0,
    totalSection: 0,
    totalLesson: 0,
    totalQuiz: 0,
    totalAssignment: 0,
    totalLecture: 0,
  }, UniqueId.generate());

  const mockDraftCourse = Course.reconstitute({
    ...mockCourse.props,
    status: CourseStatus.DRAFT,
  }, UniqueId.generate());

  const mockSection = Section.reconstitute({
    courseId: mockCourse.id,
    title: 'Section 1',
    orderIndex: 1,
  }, UniqueId.generate());

  const mockPreviewLesson = Lesson.reconstitute({
    sectionId: mockSection.id,
    title: 'Preview Lesson',
    type: LessonType.VIDEO,
    contentUrl: 'http://video.mp4',
    textContent: 'Preview text',
    duration: 100,
    orderIndex: 1,
    isFreePreview: true,
  }, UniqueId.generate());

  const mockPaidLesson = Lesson.reconstitute({
    sectionId: mockSection.id,
    title: 'Paid Lesson',
    type: LessonType.VIDEO,
    contentUrl: 'http://paid.mp4',
    textContent: 'Paid text',
    duration: 200,
    orderIndex: 2,
    isFreePreview: false,
  }, UniqueId.generate());

  const mockCourseRepo = {
    findById: jest.fn().mockImplementation(async (id: UniqueId) => {
      if (id.equals(mockCourse.id)) return mockCourse;
      if (id.equals(mockDraftCourse.id)) return mockDraftCourse;
      return null;
    }),
    findBySlug: jest.fn().mockImplementation(async (slug: string) => {
      if (slug === mockCourse.slug) return mockCourse;
      if (slug === mockDraftCourse.slug) return mockDraftCourse;
      return null;
    }),
    findAllWithOffset: jest.fn().mockImplementation(async () => {
      const pageMeta = new PageMetaDto({ itemCount: 1, pageOptionsDto: new PublicCourseQueryDto() });
      return new PageDto([mockCourse], pageMeta);
    }),
  };

  const mockCategoryRepo = {
    findById: jest.fn().mockResolvedValue({ id: mockCourse.categoryId, name: 'Web Development' }),
    findByNameOrSlug: jest.fn(),
  };

  const mockUserRepo = {
    findById: jest.fn().mockResolvedValue({ id: mockCourse.instructorId, fullName: 'John Doe' }),
  };

  const mockSectionRepo = {
    findByCourseId: jest.fn().mockResolvedValue([mockSection]),
  };

  const mockLessonRepo = {
    findBySectionId: jest.fn().mockResolvedValue([mockPreviewLesson, mockPaidLesson]),
  };

  const mockReviewRepo = {
    findByCourseId: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPublicCoursesUseCase,
        GetPublicCourseDetailUseCase,
        GetPublicCourseReviewsUseCase,
        { provide: ICOURSE_REPOSITORY, useValue: mockCourseRepo },
        { provide: ICATEGORY_REPOSITORY, useValue: mockCategoryRepo },
        { provide: IUSER_REPOSITORY, useValue: mockUserRepo },
        { provide: ISECTION_REPOSITORY, useValue: mockSectionRepo },
        { provide: ILESSON_REPOSITORY, useValue: mockLessonRepo },
        { provide: IREVIEW_REPOSITORY, useValue: mockReviewRepo },
      ],
    }).compile();

    getPublicCoursesUseCase = module.get<GetPublicCoursesUseCase>(GetPublicCoursesUseCase);
    getPublicCourseDetailUseCase = module.get<GetPublicCourseDetailUseCase>(GetPublicCourseDetailUseCase);
  });

  describe('GetPublicCoursesUseCase', () => {
    it('should retrieve a list of public courses', async () => {
      const result = await getPublicCoursesUseCase.execute(new PublicCourseQueryDto());
      expect(result.data.length).toBe(1);
      expect(result.data[0].title).toBe('Published Course');
    });
  });

  describe('GetPublicCourseDetailUseCase', () => {
    it('should throw NotFoundException if course does not exist or is DRAFT', async () => {
      await expect(getPublicCourseDetailUseCase.execute(mockDraftCourse.id.value)).rejects.toThrow(NotFoundException);
      await expect(getPublicCourseDetailUseCase.execute('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should sanitize paid lessons and keep preview lesson details', async () => {
      const result = await getPublicCourseDetailUseCase.execute(mockCourse.id.value);
      const lessons = result.sections[0].lessons;

      const preview = lessons.find(l => l.id === mockPreviewLesson.id.value);
      expect(preview).toBeDefined();
      expect(preview?.contentUrl).toBe('http://video.mp4');
      expect(preview?.videoUrl).toBe('http://video.mp4');
      expect(preview?.textContent).toBe('Preview text');

      const paid = lessons.find(l => l.id === mockPaidLesson.id.value);
      expect(paid).toBeDefined();
      expect(paid?.contentUrl).toBe('');
      expect(paid?.videoUrl).toBe('');
      expect(paid?.textContent).toBe('');
    });
  });
});
