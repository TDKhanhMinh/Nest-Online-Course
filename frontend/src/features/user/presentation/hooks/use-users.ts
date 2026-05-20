import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../infrastructure/user.service";
import { UpdateUserDto } from "../../domain/user.types";
import { toast } from "sonner";

export const useUsers = (params: { limit?: number; offset?: number; search?: string } = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getAll(params),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};
