import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCookie, destroyCookie } from "nookies";
import http from "@/lib/http";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth, fetchUserProfile } from "@/store/authSlice";
import useStreamChat from "@/hooks/useStreamChat";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ResendOTPPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  TwoFactorVerifyPayload,
  VerifyEmailPayload,
  ClientLoginResponseBody,
} from "@/types/auth";
import {
  APP_AUTH_PORTAL,
  assertLoginAccountTypeOrThrow,
  wrongPortalLoginMessage,
} from "@/lib/authPortal";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuthAPI = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { disconnectUser } = useStreamChat();

  // 🔐 Sign In
  const signInMutation = useMutation({
    mutationFn: async (payload: SignInPayload) => {
      const response = await http.post<ClientLoginResponseBody>("/auth/login", {
        ...payload,
        portal: APP_AUTH_PORTAL,
      });
      const data = response.data;
      if (!data?.twoFactorRequired) assertLoginAccountTypeOrThrow(data);
      return data;
    },
    onSuccess: (data) => {
      // If 2FA is required, skip token storage — page handles the redirect
      if (data?.twoFactorRequired) return;

      if (data?.accessToken) {
        setCookie(null, "accessToken", data.accessToken, { maxAge: 30 * 60, path: "/" });
      }
      if (data?.refreshToken) {
        setCookie(null, "refreshToken", data.refreshToken, { maxAge: 24 * 60 * 60, path: "/" });
      }
      dispatch(fetchUserProfile());
      toast.success("Welcome back!");
    },
    onError: (error: any) => {
      if (error?.wrongPortal) {
        toast.error(error.message || wrongPortalLoginMessage());
        return;
      }
      const status = error?.response?.status;
      const msg =
        error?.response?.data?.responseMessage || error?.response?.data?.message;
      if (status === 403) {
        toast.error(msg || wrongPortalLoginMessage());
        return;
      }
      toast.error(msg || "Sign in failed");
    },
  });

  // 🔁 Resend Two-Factor Code
  const resendTwoFactorMutation = useMutation({
    mutationFn: async (payload: { challengeId: number }) => {
      const response = await http.post("/auth/resend-2fa-code", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("A new code has been sent.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to resend code"
      );
    },
  });

  // 🔐 Verify Two-Factor Challenge
  const verifyTwoFactorMutation = useMutation({
    mutationFn: async (payload: TwoFactorVerifyPayload) => {
      const response = await http.post<ClientLoginResponseBody>(
        "/auth/two-factor/verify",
        payload
      );
      const data = response.data;
      assertLoginAccountTypeOrThrow(data);
      return data;
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        setCookie(null, "accessToken", data.accessToken, { maxAge: 30 * 60, path: "/" });
      }
      if (data?.refreshToken) {
        setCookie(null, "refreshToken", data.refreshToken, { maxAge: 24 * 60 * 60, path: "/" });
      }
      dispatch(fetchUserProfile());
      toast.success("Welcome back!");
    },
    onError: (error: any) => {
      if (error?.wrongPortal) {
        toast.error(error.message || wrongPortalLoginMessage());
        return;
      }
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Invalid or expired code"
      );
    },
  });

  // 🛡️ Enable Two-Factor Authentication
  const enableTwoFactorMutation = useMutation({
    mutationFn: async () => {
      const response = await http.post("/users/two-factor/enable");
      return response.data;
    },
    onSuccess: () => {
      dispatch(fetchUserProfile());
      toast.success("Two-factor authentication enabled.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to enable two-factor authentication"
      );
    },
  });

  // 🛡️ Disable Two-Factor Authentication
  const disableTwoFactorMutation = useMutation({
    mutationFn: async () => {
      const response = await http.post("/users/two-factor/disable");
      return response.data;
    },
    onSuccess: () => {
      dispatch(fetchUserProfile());
      toast.success("Two-factor authentication disabled.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to disable two-factor authentication"
      );
    },
  });

  // 📝 Sign Up / Register
  const signUpMutation = useMutation({
    mutationFn: async (payload: SignUpPayload) => {
      const response = await http.post("/auth/register", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Account created! Please check your email.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Registration failed"
      );
    },
  });

  // 🔑 Forgot Password
  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const response = await http.post("/auth/forgot-password", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Reset link sent to your email!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to send reset link"
      );
    },
  });

  // 🔒 Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await http.post("/auth/reset-password", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Password reset successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to reset password"
      );
    },
  });

  // ✉️ Verify Email (token from email link)
  const verifyEmailMutation = useMutation({
    mutationFn: async (payload: VerifyEmailPayload) => {
      const response = await http.post("/auth/verify-email", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Email verified successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Verification failed"
      );
    },
  });

  // 🔁 Resend Verification Email
  const resendOTPMutation = useMutation({
    mutationFn: async (payload: ResendOTPPayload) => {
      const response = await http.post("/auth/resend-verification", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Verification email resent!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to resend verification email"
      );
    },
  });

  // 🔑 Change Password
  const changePasswordMutation = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await http.patch("/auth/password", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.responseMessage || "Password changed successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to change password"
      );
    },
  });

  // 🚪 Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await http.post("/auth/sign-out");
      return response.data;
    },
    onSuccess: () => {
      destroyCookie(null, "accessToken", { path: "/" });
      destroyCookie(null, "refreshToken", { path: "/" });
      dispatch(clearAuth());
      queryClient.clear();
      void disconnectUser();
      toast.success("You've been signed out.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Sign out failed. Please try again."
      );
    },
  });

  return {
    // 🔐 Sign In
    signInAsync: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,

    // 🔐 Two-Factor Verify
    verifyTwoFactorAsync: verifyTwoFactorMutation.mutateAsync,
    isVerifyingTwoFactor: verifyTwoFactorMutation.isPending,

    // 🔁 Resend Two-Factor Code
    resendTwoFactorAsync: resendTwoFactorMutation.mutateAsync,
    isResendingTwoFactor: resendTwoFactorMutation.isPending,

    // 🛡️ Enable / Disable Two-Factor
    enableTwoFactorAsync: enableTwoFactorMutation.mutateAsync,
    isEnablingTwoFactor: enableTwoFactorMutation.isPending,
    disableTwoFactorAsync: disableTwoFactorMutation.mutateAsync,
    isDisablingTwoFactor: disableTwoFactorMutation.isPending,

    // 📝 Sign Up
    signUpAsync: signUpMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    // 🔑 Forgot Password
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isSendingResetLink: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    // 🔒 Reset Password
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // ✉️ Verify Email
    verifyEmailAsync: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,

    // 🔁 Resend Verification Email
    resendOTPAsync: resendOTPMutation.mutateAsync,
    isResendingOTP: resendOTPMutation.isPending,
    resendOTPError: resendOTPMutation.error,

    // 🔑 Change Password
    changePasswordAsync: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,

    // 🚪 Logout
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
