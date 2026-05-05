import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUseCase, registerUseCase, registerInstructorUseCase } from "../../application/auth.use-cases";
import { queryKeys } from "@/lib/query-keys";
import { LoginDTO, RegisterDTO, RegisterInstructorDTO, User } from "../../infrastructure/auth.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/types/api";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginDTO) => loginUseCase.execute(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      queryClient.setQueryData(queryKeys.auth.me(), response.user);
      
      toast.success("Login successful!");
      router.push("/");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDTO) => registerUseCase.execute(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      queryClient.setQueryData(queryKeys.auth.me(), response.user);
      
      toast.success("Registration successful!");
      router.push("/");
    },
    onError: (error: ApiErrorResponse) => {
      if (error.details && Array.isArray(error.details)) {
        error.details.forEach((detail) => {
          toast.error(`${detail.property}: ${detail.message}`);
        });
      } else {
        toast.error(error.message || "Registration failed");
      }
    },
  });
};

export const useRegisterInstructor = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInstructorDTO) => registerInstructorUseCase.execute(data),
    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      queryClient.setQueryData(queryKeys.auth.me(), response.user);
      
      toast.success("Instructor registration successful!");
      router.push("/");
    },
    onError: (error: ApiErrorResponse) => {
      if (error.details && Array.isArray(error.details)) {
        error.details.forEach((detail) => {
          toast.error(`${detail.property}: ${detail.message}`);
        });
      } else {
        toast.error(error.message || "Registration failed");
      }
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    queryClient.removeQueries({ queryKey: queryKeys.auth.all });
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return { logout };
};

export const useMe = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => {
      const user = localStorage.getItem("user");
      return user ? (JSON.parse(user) as User) : null;
    },
    staleTime: Infinity, // Keep it in cache as it's local
  });
};
