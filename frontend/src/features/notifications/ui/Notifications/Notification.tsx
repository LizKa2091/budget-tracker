import type { FC } from 'react';
import NotificationItem from '../NotificationItem/NotificationItem';
import NotificationExports from '../../../../shared/context/NotificationContext';

const Notifications: FC = () => {
   const { notifications } = NotificationExports.useNotifications();

   if (!notifications || !notifications.length) {
      return null;
   }

   return (
      notifications.map(notif => 
         <NotificationItem key={notif.id} {...notif} />
      )      
   )
}

export default Notifications;