export interface IRegisterResponse {
   message: string;
};

export interface ILoginRequestResponse {
   token: string;
};

export interface ILogoutResponse {
   message: string;
};

export type userData = {
   email: string;
   name: string;
}

export interface IVerifyAuthStatusResponse {
   message: string;
   token: string;
   user: userData;
};

export interface IForgotPasswordResponse {
   message: string;
   resetToken?: string;
};

export interface IResetPasswordResponse {
   message: string;
};