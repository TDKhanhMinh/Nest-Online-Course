import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getInstructorCoursesUseCase } from "../../application/get-instructor-courses.use-case";
import { CoursePaginationDto } from "../../infrastructure/course.api";

export const useInstructorCourses = (params?: CoursePaginationDto) => {
  return useQuery({
    queryKey: [...queryKeys.courses.instructor(), params],
    queryFn: () => getInstructorCoursesUseCase.execute(params),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
};

