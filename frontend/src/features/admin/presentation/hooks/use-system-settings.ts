import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSystemSettingsUseCase, updateSystemSettingsUseCase } from "../../application/system-settings.use-cases";
import { UpdateSystemSettingsDto } from "../../domain/system-settings.types";
import { toast } from "sonner";

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ["admin", "system-settings"],
    queryFn: () => getSystemSettingsUseCase.execute(),
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSystemSettingsDto) => updateSystemSettingsUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "system-settings"] });
      toast.success("System settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update system settings");
    },
  });
};
