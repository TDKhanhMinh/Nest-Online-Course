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
  PENDING_APPROVAL = "PENDING_APPROVE",
  APPROVED = "APPROVED",
  ALL = "ALL",
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  // shortDescription: string;
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
  // UI helper fields
  rating?: number;
  thumbnail?: string;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  type: "video" | "text" | "quiz" | "assignment";
  order: number;
  content?: string;
  videoUrl?: string;
  duration?: string;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
  contentUrl?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}
