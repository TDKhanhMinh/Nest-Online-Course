import { useQuery } from "@tanstack/react-query";
import { getCoursesUseCase } from "../../application/get-courses.use-case";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => getCoursesUseCase.execute(),
  });
};
