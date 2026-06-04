import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "../../infrastructure/enrollment.api";

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  myList: () => [...enrollmentKeys.all, "my"] as const,
  status: (courseId: string) =>
    [...enrollmentKeys.all, "status", courseId] as const,
};

export const useEnrollmentsQuery = () => {
  return useQuery({
    queryKey: enrollmentKeys.myList(),
    queryFn: () => enrollmentApi.getMyEnrollments(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useEnrollmentStatusQuery = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: enrollmentKeys.status(courseId),
    queryFn: () => enrollmentApi.getEnrollmentStatus(courseId),
    staleTime: 1000 * 60 * 5,
    enabled: !!courseId && enabled,
  });
};
