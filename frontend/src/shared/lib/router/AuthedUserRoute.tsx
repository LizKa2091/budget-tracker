import type { FC, JSX } from 'react';
import AuthExports from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface IAuthedUserRouteProps {
   children: JSX.Element;
};

const AuthedUserRoute: FC<IAuthedUserRouteProps> = ({ children }) => {
   const { token } = AuthExports.useAuthContext();

   if (!token) {
      return <Navigate to='/auth' />
   }

   return children;
}

export default AuthedUserRoute;