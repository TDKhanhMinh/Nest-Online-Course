import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../../infrastructure/cart.api";
import { enrollmentKeys } from "@/features/student/presentation/hooks/use-enrollments";
import { toast } from "sonner";

export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
};

export const useCartQuery = () => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: () => cartApi.getCart(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => cartApi.addToCart(courseId),
    onSuccess: (_data, courseId) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.status(courseId) });
      toast.success("Course added to cart");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to add course to cart"));
    },
  });
};

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => cartApi.removeFromCart(courseId),
    onSuccess: (_data, courseId) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.status(courseId) });
      toast.success("Course removed from cart");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to remove course from cart"));
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to clear cart"));
    },
  });
};
