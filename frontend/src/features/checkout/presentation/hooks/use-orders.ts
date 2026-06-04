import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../../infrastructure/order.api";
import { cartKeys } from "./use-cart";
import { enrollmentKeys } from "@/features/student/presentation/hooks/use-enrollments";
import { toast } from "sonner";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => orderApi.getOrders(),
    staleTime: 1000 * 60 * 5,
  });
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderApi.checkout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      toast.success("Checkout successful! Your courses are ready.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Checkout failed. Please try again."));
    },
  });
};
