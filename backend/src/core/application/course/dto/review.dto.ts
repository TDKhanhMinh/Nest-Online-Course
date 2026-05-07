export class CreateReviewDto {
  courseId: string;
  rating: number;
  comment: string;
}

export class ReviewResponseDto {
  id: string;
  courseId: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
