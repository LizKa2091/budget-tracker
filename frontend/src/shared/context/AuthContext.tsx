import { createContext, useContext, useState, type FC, type ReactNode } from 'react';
import { useForgotPassword, useLoginUser, useLogoutUser, useRegisterUser, useResetPassword, useVerifyAuthStatus } from '../../features/auth/model/useAuth';
import type { IForgotPasswordResponse, ILoginRequestResponse, ILogoutResponse, IRegisterResponse, IResetPasswordResponse, IVerifyAuthStatusResponse } from '../../features/auth/authTypes';

interface IAuthContext {
   isAuthed: boolean | null;
   token: string | null;
   register: (email: string, password: string, name: string) => Promise<IRegisterResponse | Error>;
   isRegistering: boolean;
   login: (email: string, password: string) => Promise<ILoginRequestResponse | Error>;
   isLogining: boolean;
   forgotPassword: (email: string) => Promise<IForgotPasswordResponse | Error>;
   isForgetting: boolean;
   resetPassword: (token: string, newPassword: string) => Promise<IResetPasswordResponse | Error>;
   isResetting: boolean;
   logout: () => Promise<ILogoutResponse | Error>;
   isLogouting: boolean;
   checkLoginStatus: () => Promise<IVerifyAuthStatusResponse>;
}

interface IAuthProvider {
   children: ReactNode;
}

const AuthContext  = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider: FC<IAuthProvider> = ({ children })=> {
   const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

   const { mutateAsync: registerMutate, isPending: isRegistering } = useRegisterUser();
   const { mutateAsync: loginMutate, isPending: isLogining } = useLoginUser();
   const { mutateAsync: forgotMutate, isPending: isForgetting } = useForgotPassword();
   const { mutateAsync: resetMutate, isPending: isResetting } = useResetPassword();
   const { mutateAsync: logoutMutate, isPending: isLogouting } = useLogoutUser();
   const { refetch: refecthAuth } = useVerifyAuthStatus(token);

   const clearAuthData = (): void => {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthed(false);
   };

   const register = async (email: string, password: string, name: string): Promise<IRegisterResponse> => {
      try {
         const result = await registerMutate({ email, password, name });
      
         return result;
      }
      catch (error) {
         return error as Error;
      }
   };

   const login = async (email: string, password: string): Promise<ILoginRequestResponse | Error> => {
      try {
         const result = await loginMutate({ email, password });
      
         if (result.token) {
            localStorage.setItem('token', result.token);
            setToken(result.token);
            setIsAuthed(true);
         }

         return result;
      }
      catch (error) {
         return error as Error;
      }
   };

   const forgotPassword = async (email: string): Promise<IForgotPasswordResponse | Error> => {
      try {
         const result = await forgotMutate({ email });

         if (result.resetToken) {
            localStorage.setItem('resetToken', result.resetToken);
         }
         else {
            localStorage.removeItem('resetToken');
         }

         return result;
      }
      catch (error) {
         return error as Error;
      }
   };

   const resetPassword = async (token: string, newPassword: string): Promise<IResetPasswordResponse | Error> => {
      try {
         const result = await resetMutate({ token, newPassword });
         
         return result;
      }
      catch (error) {
         return error as Error;
      }
      finally {
         localStorage.removeItem('resetToken');
      }
   };

   const logout = async (): Promise<ILogoutResponse | Error> => {
      try {
         const result = await logoutMutate();
         return result;
      }
      catch (error) {
         return error as Error;
      }
      finally {
         clearAuthData();
      }
   };

   const checkLoginStatus = async (): Promise<IVerifyAuthStatusResponse> => {
      if (!token) {
         clearAuthData();

         throw new Error('нет токена');
      }
      
      const result = await refecthAuth();

      if (result.error || !result.data) {
         clearAuthData();

         throw new Error(result.error?.message ?? 'Произошла ошибка при авторизации');
      }

      setIsAuthed(true);
      return result.data;
   };

   return (
      <AuthContext.Provider value={{ isAuthed, token, register, isRegistering, login, isLogining, forgotPassword, isForgetting, resetPassword, isResetting, logout, isLogouting, checkLoginStatus }}>
         {children}
      </AuthContext.Provider>
   );
}

const useAuthContext = () => {
   const context = useContext(AuthContext);

   if (!context) throw new Error('AuthContext должен использоваться внутри AuthContextProvider');

   return context; 
}

const AuthExports = { AuthContext, AuthContextProvider, useAuthContext };

export default AuthExports;