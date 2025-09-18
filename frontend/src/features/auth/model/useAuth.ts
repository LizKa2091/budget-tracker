import { useMutation, useQuery } from "@tanstack/react-query";
import { tokenAxios } from "../../../shared/api/axios";
import { type IForgotPasswordResponse, type ILoginRequestResponse, type ILogoutResponse, type IRegisterResponse, type IResetPasswordResponse, type IVerifyAuthStatusResponse } from "../authTypes";

export const useRegisterUser = () => {
   return useMutation<IRegisterResponse, Error, { email: string, password: string, name: string }>({
      mutationKey: ['userRegister'],
      mutationFn: async ({ email, password, name }) => {
         const { data } = await tokenAxios.post<IRegisterResponse>('/register', { email, password, name });
         return data;         
      },
      retry: 1
   });
};

export const useLoginUser = () => {
   return useMutation<ILoginRequestResponse, Error, {email: string, password: string}>({
      mutationKey: ['userLogin'],
      mutationFn: async ({ email, password }) => {
         const { data } = await tokenAxios.post<ILoginRequestResponse>('/login', { email, password });
         return data;
      },
      retry: 1
   })
};

export const useLogoutUser = () => {
   return useMutation<ILogoutResponse, Error>({
      mutationKey: ['userLogout'],
      mutationFn: async () => {
         const { data } = await tokenAxios.post<ILogoutResponse>('/logout');
         return data;
      },
      retry: 1
   })
};

export const useVerifyAuthStatus = (token: string | null) => {
   return useQuery<IVerifyAuthStatusResponse, Error>({
      queryKey: ['userVerify', token],
      queryFn: async () => {
         const { data } = await tokenAxios.get<IVerifyAuthStatusResponse>('/me');
         return data;
      },
      enabled: !!token,
      retry: false
   })
};

export const useForgotPassword = () => {
   return useMutation<IForgotPasswordResponse, Error, { email: string }>({
      mutationKey: ['userForgotPass'],
      mutationFn: async ({ email }) => {
         const { data } = await tokenAxios.post<IForgotPasswordResponse>('/forgot-password', { email });
         return data;
      },
      retry: 1
   })
};

export const useResetPassword = () => {
   return useMutation<IResetPasswordResponse, Error, { token: string, newPassword: string }>({
      mutationKey: ['userResetPass'],
      mutationFn: async ({ token, newPassword }) => {
         const { data } = await tokenAxios.post<IResetPasswordResponse>('/reset-password', { token, newPassword });
         return data;
      },
      retry: 1
   })
};