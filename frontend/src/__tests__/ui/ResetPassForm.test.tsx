import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockResetPassword = vi.fn();

vi.mock('@/shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn(),
   },
}));

import ResetPassForm from '@/features/auth/ui/ResetPassForm/ResetPassForm';
import AuthExports from '@/shared/context/AuthContext';

describe('ResetPassForm tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
      localStorage.clear();

      vi.mocked(AuthExports.useAuthContext).mockReturnValue({
         resetPassword: mockResetPassword,
         isResetting: false,
      });
   });

   test('renders form with fields and button', () => {
      const { container } = render(
         <MemoryRouter>
            <ResetPassForm />
         </MemoryRouter>
      );

      expect(screen.getByText('Смена пароля')).toBeInTheDocument();

      const newPass = container.querySelector('input[name="newPassword"]');
      const newPassRepeat = container.querySelector('input[name="newPasswordRepeat"]');

      expect(newPass).toBeInTheDocument();
      expect(newPassRepeat).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Сменить пароль' })).toBeInTheDocument();
   });

   test('показывает ошибку если resetToken отсутствует', async () => {
      const { container } = render(
         <MemoryRouter>
            <ResetPassForm />
         </MemoryRouter>
      );

      const newPass = container.querySelector('input[name="newPassword"]')!;
      const newPassRepeat = container.querySelector('input[name="newPasswordRepeat"]')!;

      fireEvent.change(newPass, { target: { value: '123456' } });
      fireEvent.change(newPassRepeat, { target: { value: '123456' } });
      fireEvent.click(screen.getByRole('button', { name: 'Сменить пароль' }));

      await waitFor(() =>
         expect(screen.getByText(/reset token/i)).toBeInTheDocument()
      );
   });
});
