import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instructorApi, UpdateInstructorProfileDto } from "../../infrastructure/instructor.api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-keys";

/**
 * Hook to fetch current instructor's profile
 */
export const useInstructorProfile = () => {
  return useQuery({
    queryKey: queryKeys.instructor.me(),
    queryFn: () => instructorApi.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to update current instructor's profile
 */
export const useUpdateInstructorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInstructorProfileDto) => 
      instructorApi.updateMyProfile(data),
    onSuccess: (updatedProfile) => {
      // Update cache manually
      queryClient.setQueryData(queryKeys.instructor.me(), updatedProfile);
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update profile";
      toast.error(message);
    }
  });
};

/**
 * Hook to register as an instructor (for existing users)
 */
export const useRegisterAsInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => instructorApi.registerInstructor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instructor.all });
      // Also invalidate auth me to update role if backend returns updated user
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      toast.success("You are now registered as an instructor!");
    },
    onError: (error: any) => {
      const message = error?.message || "Registration failed";
      toast.error(message);
    }
  });
};
