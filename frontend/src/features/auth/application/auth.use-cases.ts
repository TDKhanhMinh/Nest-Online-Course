import { authApi, LoginDTO, RegisterDTO, RegisterInstructorDTO, AuthResponse } from "../infrastructure/auth.api";

export class LoginUseCase {
  async execute(data: LoginDTO): Promise<AuthResponse> {
    return await authApi.login(data);
  }
}

export class RegisterUseCase {
  async execute(data: RegisterDTO): Promise<AuthResponse> {
    return await authApi.register(data);
  }
}

export class RegisterInstructorUseCase {
  async execute(data: RegisterInstructorDTO): Promise<AuthResponse> {
    return await authApi.registerInstructor(data);
  }
}

export const loginUseCase = new LoginUseCase();
export const registerUseCase = new RegisterUseCase();
export const registerInstructorUseCase = new RegisterInstructorUseCase();
