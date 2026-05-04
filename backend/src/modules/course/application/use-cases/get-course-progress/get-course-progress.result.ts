export interface LessonProgressDto {
  lessonId: string;
  title: string;
  order: number;
  isCompleted: boolean;
  lastScore: number;
}

export interface GetCourseProgressResult {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  eligibleForCertificate: boolean;
  lessons: LessonProgressDto[];
}
