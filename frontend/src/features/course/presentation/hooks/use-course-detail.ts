import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { getCourseDetailUseCase } from "../../application/get-course-detail.use-case";

export const useCourseDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => getCourseDetailUseCase.execute(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
};
