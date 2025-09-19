import { useEffect, type FC, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import AuthExports from '../../context/AuthContext';
import NotificationExports from '../../context/NotificationContext';

interface IAuthedUserRouteProps {
   children: JSX.Element;
}

const AuthedUserRoute: FC<IAuthedUserRouteProps> = ({ children }) => {
   const { token } = AuthExports.useAuthContext();
   const { addNotification } = NotificationExports.useNotifications();

   useEffect(() => {
      if (!token) {
         addNotification('', 'Пожалуйста, авторизуйтесь', 'error');
      }
   }, [token, addNotification]);


   if (!token) {
      return <Navigate to='/auth' />
   }

   return children;
}

export default AuthedUserRoute