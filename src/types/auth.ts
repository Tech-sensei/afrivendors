export interface AuthPhoneNumber {
  code: string;
  number: string;
}

export interface Address {
  id: number;
  label: string;
  streetAddress: string;
  city: string;
  state: string;
}

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  dob?: string | null;
  gender?: string | null;
  profilePhoto?: string | null;
  phoneNumber?: string;
  emailVerifiedAt?: string | null;
  addresses?: Address[];
  accountType?: string;
  adminRoles?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  phoneNumber: AuthPhoneNumber;
  accountType: "user";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResendOTPPayload {
  email: string;
}
