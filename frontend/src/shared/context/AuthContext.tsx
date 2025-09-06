import { createContext, useContext, useState, type FC, type ReactNode } from 'react';
import type { ILoginRequestResponse, ILogoutResponse, IRegisterResponse, IVerifyAuthStatusResponse } from '../../features/auth/authTypes';
import { useLoginUser, useLogoutUser, useRegisterUser, useVerifyAuthStatus } from '../../features/auth/model/useAuth';

interface IAuthContext {
   isAuthed: boolean | null;
   token: string | null;
   register: (email: string, password: string, name: string) => Promise<IRegisterResponse | Error>;
   login: (email: string, password: string) => Promise<ILoginRequestResponse | Error>;
   logout: () => Promise<ILogoutResponse | Error>;
   checkLoginStatus: () => Promise<IVerifyAuthStatusResponse>;
};

interface IAuthProvider {
   children: ReactNode;
};

const AuthContext  = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider: FC<IAuthProvider> = ({ children })=> {
   const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

   const { mutateAsync: registerMutate } = useRegisterUser();
   const { mutateAsync: loginMutate } = useLoginUser();
   const { mutateAsync: logoutMutate } = useLogoutUser();
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

   const logout = async (): Promise<ILogoutResponse | Error> => {
      try {
         const response = await logoutMutate();
         return response;
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
      <AuthContext.Provider value={{ isAuthed, token, register, login, logout, checkLoginStatus }}>
         {children}
      </AuthContext.Provider>
   );
};

const useAuthContext = () => {
   const context = useContext(AuthContext);

   if (!context) throw new Error('AuthContext должен использоваться внутри AuthContextProvider');

   return context;
}

const AuthExports = { AuthContext, AuthContextProvider, useAuthContext };

export default AuthExports;