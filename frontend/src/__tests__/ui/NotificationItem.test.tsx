import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from '../../features/notifications/ui/NotificationItem/NotificationItem';

const removeNotification = vi.fn();

vi.mock('@/shared/context/NotificationContext', () => ({
   __esModule: true,
   default: {
      useNotifications: () => ({ removeNotification }),
   },
}));

describe('NotificationItem tests', () => {
   const defaultProps = {
      id: '1',
      title: 'Заголовок',
      message: 'Текст уведомления',
      type: 'info' as const,
   };

   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders', () => {
      render(<NotificationItem {...defaultProps} />);
      
      expect(screen.getByText('Заголовок')).toBeInTheDocument();
      expect(screen.getByText('Текст уведомления')).toBeInTheDocument();
   });

   test('displays notification type', () => {
      render(<NotificationItem {...defaultProps} type="error" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toMatch(/ant-alert-error/);
   });

   test('closes notification and calls removeNotification on close', () => {
      render(<NotificationItem {...defaultProps} />);

      const closeButton = screen.getByRole('button');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Заголовок')).not.toBeInTheDocument();

      expect(removeNotification).toHaveBeenCalledWith('1');
   });

   test('renders nothing if closed=true', () => {
      const { rerender } = render(<NotificationItem {...defaultProps} />);
      const closeButton = screen.getByRole('button');

      fireEvent.click(closeButton);

      rerender(<NotificationItem {...defaultProps} />);
      expect(screen.queryByText('Заголовок')).not.toBeInTheDocument();
   });
});