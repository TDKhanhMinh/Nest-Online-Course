import { CourseLevel } from '@shared/types/course-level.enum';
import { LessonType } from '@shared/types/lesson-type.enum';

export class PublicLessonDto {
  id: string;
  sectionId: string;
  title: string;
  type: LessonType;
  orderIndex: number;
  duration?: number;
  isFreePreview: boolean;
  contentUrl?: string;
  textContent?: string;
  videoUrl?: string;
}

export class PublicSectionDto {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: PublicLessonDto[];
}

export class PublicCourseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: CourseLevel;
  language: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructorName: string;
  categoryId: string;
  categoryName: string;
  avgRating: number;
  totalReviews: number;
  totalStudents: number;
  createdAt?: Date;
  updatedAt?: Date;
  author: string;
  category: string;
}

export class PublicCourseDetailDto extends PublicCourseDto {
  sections: PublicSectionDto[];
}

export class PublicReviewDto {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}
