import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getCoursesUseCase } from "../../application/get-courses.use-case";

export const useCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.all,
    queryFn: () => getCoursesUseCase.execute(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
