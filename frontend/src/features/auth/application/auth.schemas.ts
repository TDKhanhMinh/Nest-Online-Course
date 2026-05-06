import * as z from "zod";

/**
 * Common regex for password complexity:
 * - At least 1 letter
 * - At least 1 number
 */
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const loginSchema = z.object({
  email: z.string().min(1, "required").max(255, "email_max").email("email"),
  password: z.string().min(1, "required").max(100, "password_max"),
});

export const signupSchema = z.object({
  fullName: z.string().min(1, "required").min(2, "fullName_min").max(100, "fullName_max"),
  email: z.string().min(1, "required").max(255, "email_max").email("email"),
  password: z
    .string()
    .min(1, "required")
    .min(8, "password_min")
    .max(100, "password_max")
    .regex(passwordRegex, "password_complexity"),
});

export const registerInstructorSchema = signupSchema.extend({
  headline: z.string().min(1, "required").min(10, "headline_min").max(120, "headline_max"),
  biography: z.string().min(1, "required").min(50, "biography_min").max(2000, "biography_max"),
  website: z.string().url("invalid_url").max(255, "invalid_url").optional().or(z.literal("")),
  twitter: z.string().url("invalid_url").max(255, "invalid_url").optional().or(z.literal("")),
  linkedin: z.string().url("invalid_url").max(255, "invalid_url").optional().or(z.literal("")),
  youtube: z.string().url("invalid_url").max(255, "invalid_url").optional().or(z.literal("")),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "required").max(255, "email_max").email("email"),
});

export const profileSchema = z.object({
  fullName: z.string().min(1, "required").min(2, "fullName_min").max(100, "fullName_max"),
  bio: z.string().max(500, "bio_max").optional().or(z.literal("")),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "required"),
  newPassword: z
    .string()
    .min(1, "required")
    .min(8, "password_min")
    .max(100, "password_max")
    .regex(passwordRegex, "password_complexity"),
  confirmPassword: z.string().min(1, "required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "password_mismatch",
  path: ["confirmPassword"],
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type RegisterInstructorValues = z.infer<typeof registerInstructorSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
