import { useState, type FC } from 'react';
import { Alert, Flex } from 'antd';
import NotificationExports from '../../../../shared/context/NotificationContext';

interface INotificationItemProps {
   id: string;
   title: string;
   message: string;
   type: 'error' | 'warning' | 'info';
}

const NotificationItem: FC<INotificationItemProps> = ({ id, title, message, type }) => {
   const { removeNotification } = NotificationExports.useNotifications();
   const [closed, setClosed] = useState<boolean>(false);

   if (closed) {
      return null;
   }

   const handleClose = () => {
      setClosed(true);
      removeNotification(id);
   };

   return (
      <Alert type={type} closable onClose={handleClose} key={id} message={
            <Flex vertical>
               <span>{title}</span>
               <span>{message}</span>
            </Flex>
         } 
      />
   )
}

export default NotificationItem