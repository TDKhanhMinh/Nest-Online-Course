export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
  UNPUBLISHED = "UNPUBLISHED",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  ALL = "ALL",
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  level: CourseLevel;
  status: CourseStatus;
  thumbnailUrl?: string;
  instructorId: string;
  categoryId: string;
  categoryName?: string;
  language: string;
  avgRating: number;
  totalReviews: number;
  totalStudents: number;
  createdAt: string;
  updatedAt: string;
  // UI helper and public mapper fields
  rating?: number;
  thumbnail?: string;
  author?: string;
  category?: string;
  categorySlug?: string;
  instructorName?: string;
  totalEnrolled?: number;
  totalReview?: number;
  averageRating?: number;
  duration?: number;
  lessons?: number;
  lessonsCount?: number;
  students?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  sections?: Section[];
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  type: "video" | "text" | "quiz" | "assignment" | string;
  order: number;
  content?: string;
  videoUrl?: string;
  duration?: string | number;
  isPreview: boolean;
  createdAt?: string;
  updatedAt?: string;
  contentUrl?: string;
  textContent?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}
