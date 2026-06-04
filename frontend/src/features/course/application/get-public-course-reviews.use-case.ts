import { courseApi } from "../infrastructure/course.api";

export class GetPublicCourseReviewsUseCase {
  async execute(idOrSlug: string): Promise<any[]> {
    const response = await courseApi.getPublicCourseReviews(idOrSlug);
    return response || [];
  }
}

export const getPublicCourseReviewsUseCase = new GetPublicCourseReviewsUseCase();
