import { useQuery } from "@tanstack/react-query";
import { getPublicCoursesUseCase } from "../../application/get-public-courses.use-case";
import { getPublicCourseReviewsUseCase } from "../../application/get-public-course-reviews.use-case";

export const usePublicCourses = (filters?: any) => {
  return useQuery({
    queryKey: ["public-courses", filters],
    queryFn: () => getPublicCoursesUseCase.execute(filters),
    staleTime: 60 * 1000, // 1 minute stale time for catalog updates
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const usePublicCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ["public-course-reviews", courseId],
    queryFn: () => getPublicCourseReviewsUseCase.execute(courseId),
    enabled: !!courseId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};
