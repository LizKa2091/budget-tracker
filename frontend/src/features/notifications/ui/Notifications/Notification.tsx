import type { FC } from 'react';
import { Flex } from 'antd';
import NotificationExports from '../../../../shared/context/NotificationContext';
import NotificationItem from '../NotificationItem/NotificationItem';
import styles from './Notification.module.scss';

const Notifications: FC = () => {
   const { notifications } = NotificationExports.useNotifications();

   if (!notifications || !notifications.length) {
      return null;
   }

   return (
      <Flex vertical gap='middle' className={styles.container}>
         {notifications.map(notif => 
            <NotificationItem key={notif.id} {...notif} />
         )}
      </Flex>  
   )
}

export default Notifications;