import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUseCase, registerInstructorUseCase, registerUseCase } from "../../application/auth.use-cases";
import { LoginDTO, RegisterDTO, RegisterInstructorDTO, Role, User } from "../../infrastructure/auth.api";

const handleRoleBasedRedirect = (user: User, router: ReturnType<typeof useRouter>) => {
  if (user.roles?.includes(Role.ADMIN)) {
    router.push("/admin");
  } else if (user.roles?.includes(Role.INSTRUCTOR)) {
    router.push("/instructor/dashboard");
  } else {
    router.push("/dashboard");
  }
};

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
      handleRoleBasedRedirect(response.user, router);
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
      handleRoleBasedRedirect(response.user, router);
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
      handleRoleBasedRedirect(response.user, router);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    // Immediately clear the user query data to update UI
    queryClient.setQueryData(queryKeys.auth.me(), null);
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
