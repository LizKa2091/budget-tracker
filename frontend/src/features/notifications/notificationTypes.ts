export interface INotificationItem {
   id: string;
   title: string;
   message: string;
   type: 'error' | 'warning' | 'info';
}