import { useQuery } from "@tanstack/react-query";
import { getCoursesUseCase } from "../../application/get-courses.use-case";
import { queryKeys } from "@/lib/query-keys";

export const useCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.all,
    queryFn: () => getCoursesUseCase.execute(),
  });
};
