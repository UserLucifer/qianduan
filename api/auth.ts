import { apiPost } from "./http";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SendEmailCodeRequest,
  SignupRequest,
  UserProfile,
  VerifyEmailCodeRequest,
} from "./types";

export type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  SendEmailCodeRequest,
  SignupRequest,
  UserProfile,
  VerifyEmailCodeRequest,
};

export const sendSignupEmailCode = (data: SendEmailCodeRequest) =>
  apiPost<void, SendEmailCodeRequest>("/api/auth/signup/email-code/send", data);

export const verifySignupEmailCode = (data: VerifyEmailCodeRequest) =>
  apiPost<void, VerifyEmailCodeRequest>("/api/auth/signup/email-code/verify", data);

export const signup = (data: SignupRequest) =>
  apiPost<LoginResponse, SignupRequest>("/api/auth/signup", data);

export const register = (data: SignupRequest) =>
  apiPost<LoginResponse, SignupRequest>("/api/auth/register", data);

export const login = (data: LoginRequest) =>
  apiPost<LoginResponse, LoginRequest>("/api/auth/login", data);

export const loginWithPassword = (data: LoginRequest) =>
  apiPost<LoginResponse, LoginRequest>("/api/auth/login/password", data);

export const sendResetPasswordCode = (data: SendEmailCodeRequest) =>
  apiPost<void, SendEmailCodeRequest>("/api/auth/reset-password/email-code/send", data);

export const verifyResetPasswordCode = (data: VerifyEmailCodeRequest) =>
  apiPost<void, VerifyEmailCodeRequest>("/api/auth/reset-password/email-code/verify", data);

export const resetPassword = (data: ResetPasswordRequest) =>
  apiPost<void, ResetPasswordRequest>("/api/auth/reset-password", data);

export const passwordReset = (data: ResetPasswordRequest) =>
  apiPost<void, ResetPasswordRequest>("/api/auth/password/reset", data);
