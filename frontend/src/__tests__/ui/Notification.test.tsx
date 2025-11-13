import { render, screen } from '@testing-library/react';
import Notifications from '../../features/notifications/ui/Notifications/Notification';

vi.mock('@/features/notifications/ui/NotificationItem/NotificationItem', () => ({
   __esModule: true,
   default: ({ title, message, type }: any) => (
      <div data-testid="mock-notification">
         <span>{title}</span>
         <span>{message}</span>
         <span>{type}</span>
      </div>
   ),
}));

const mockNotifications = [
   { id: '1', title: 'Ошибка', message: 'Что-то пошло не так', type: 'error' },
   { id: '2', title: 'Успех', message: 'Все хорошо', type: 'info' },
];

vi.mock('@/shared/context/NotificationContext', () => ({
   __esModule: true,
   default: {
      useNotifications: vi.fn(),
   },
}));

import NotificationExports from '../../shared/context/NotificationContext';

describe('Notifications tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('does not render if notifications is empty', () => {
      (NotificationExports.useNotifications as any).mockReturnValue({ notifications: [] });

      const { container } = render(<Notifications />);
      expect(container.firstChild).toBeNull();
   });

   test('does not render if notifications are undefined', () => {
      (NotificationExports.useNotifications as any).mockReturnValue({ notifications: undefined });

      const { container } = render(<Notifications />);
      expect(container.firstChild).toBeNull();
   });

   test('renders notifications list if they exist', () => {
      (NotificationExports.useNotifications as any).mockReturnValue({ notifications: mockNotifications });

      render(<Notifications />);

      const items = screen.getAllByTestId('mock-notification');

      expect(items).toHaveLength(2);
      expect(screen.getByText('Ошибка')).toBeInTheDocument();
      expect(screen.getByText('Все хорошо')).toBeInTheDocument();
   });

   test('passes correct props to NotificationItem', () => {
      (NotificationExports.useNotifications as any).mockReturnValue({ notifications: mockNotifications });

      render(<Notifications />);
      
      expect(screen.getByText('Ошибка')).toBeInTheDocument();
      expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
      expect(screen.getByText('info')).toBeInTheDocument();
   });
});
