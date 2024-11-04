export interface IUser {
  userId?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isActive?: boolean;
  forgotPwToken?: string;
  sendForgotPwExp?: number;
}