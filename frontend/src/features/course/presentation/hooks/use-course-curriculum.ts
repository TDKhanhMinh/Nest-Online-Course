import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getCourseCurriculumUseCase } from "../../application/get-course-curriculum.use-case";

export const useCourseCurriculum = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.courses.curriculum(courseId),
    queryFn: () => getCourseCurriculumUseCase.execute(courseId),
    enabled: !!courseId,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
};
