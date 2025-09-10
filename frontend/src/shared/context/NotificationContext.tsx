import { createContext, useCallback, useContext, useState, type FC, type ReactNode } from "react";
import type { INotificationItem } from "../../features/notifications/notificationTypes";

interface INotificationContext {
   notifications: INotificationItem[];
   addNotification: (title: string, message: string, type: 'error' | 'warning' | 'info') => void;
   removeNotification: (id: string) => void;
};

interface INotificationProviderProps {
   children: ReactNode;
};

const NotificationContext = createContext<INotificationContext | undefined>(undefined);

const NotificationProvider: FC<INotificationProviderProps> = ({ children }) => {
   const [notifications, setNotifications] = useState<INotificationItem[]>([]);

   const addNotification = useCallback((title: string, message: string, type: 'error' | 'warning' | 'info') => {
      setNotifications(prev => [
         ...prev,
         {
            id: Date.now().toString(),
            title,
            message,
            type
         }
      ]);
}, []);

   const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
   }

   return (
      <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
         {children}
      </NotificationContext.Provider>
   )
};

const useNotifications = () => {
   const context = useContext(NotificationContext);

   if (!context) throw new Error('useTheme должен использоваться внутри NotificationProvider');
   return context;
};

const NotificationExports = { NotificationContext, NotificationProvider, useNotifications };

export default NotificationExports;