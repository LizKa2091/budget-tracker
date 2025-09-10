import type { FC, JSX } from 'react';
import AuthExports from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface IGuestRouteProps {
   children: JSX.Element;
}

const GuestRoute: FC<IGuestRouteProps> = ({ children }) => {
   const { token } = AuthExports.useAuthContext();

   if (token) {
      return <Navigate to='/' />
   }

   return children;
}

export default GuestRoute;