import { describe, expect, test, vi } from 'vitest';
import AuthExports from '../../shared/context/AuthContext';
import { render, screen, waitFor } from '@testing-library/react';
import ForgotPassForm from '../../features/auth/ui/ForgotPassForm/ForgotPassForm';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../shared/context/AuthContext', () => {
   return {
      default: {
         useAuthContext: vi.fn()
      }
   };
});

describe('ForgotPassForm tests', () => {
   const forgotPassMock = vi.fn();

   (AuthExports.useAuthContext as unknown as vi.Mock).mockReturnValue({
      forgotPassword: forgotPassMock,
      isForgetting: false
   });

   test('renders form with input fields', () => {
      render(<ForgotPassForm />);

      expect(screen.getByText('Восстановление пароля')).toBeInTheDocument();
      expect(screen.getByLabelText('Почта')).toBeInTheDocument();
      expect(
         screen.getByRole('button', { name: 'Найти аккаунт' })
      ).toBeInTheDocument();
   });

   test('displays validation error if no email', async () => {
      render(<ForgotPassForm />);

      const button = screen.getByRole('button', { name: 'Найти аккаунт' });
      await userEvent.click(button);

      expect(await screen.findByText('Введите почту')).toBeInTheDocument();
   });

   test('displays validation error if invalid email', async () => {
      render(<ForgotPassForm />);

      const input = screen.getByRole('textbox', { name: /Почта/i });
      await userEvent.type(input, 'invalid-email');

      const button = screen.getByRole('button', { name: 'Найти аккаунт' });
      await userEvent.click(button);

      expect(
         await screen.findByText('Неверный формат почты')
      ).toBeInTheDocument();
   });

   test('calls forgotPassword and displays error message', async () => {
      forgotPassMock.mockResolvedValueOnce(new Error('Пользователь не найден'));

      render(<ForgotPassForm />);

      const input = screen.getByLabelText('Почта');
      await userEvent.type(input, 'user@gmail.com');

      const button = screen.getByRole('button', { name: 'Найти аккаунт' });
      await userEvent.click(button);

      await waitFor(() => {
         expect(forgotPassMock).toHaveBeenCalledWith('user@gmail.com');
      });

      expect(
         await screen.findByText('Пользователь не найден')
      ).toBeInTheDocument();
      expect(
         screen.queryByRole('link', { name: 'Сменить пароль' })
      ).not.toBeInTheDocument();
   });

   test('if success response save resetToken and display link', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      forgotPassMock.mockResolvedValueOnce({
         message: 'Проверьте почту',
         resetToken: 'resetToken'
      });

      render(
         <MemoryRouter>
            <ForgotPassForm />
         </MemoryRouter>
      );

      const input = screen.getByLabelText('Почта');
      await userEvent.type(input, 'user@gmail.com');

      const button = screen.getByRole('button', { name: 'Найти аккаунт' });
      await userEvent.click(button);

      await waitFor(() => {
         expect(forgotPassMock).toHaveBeenCalledWith('user@gmail.com');
         expect(setItemSpy).toHaveBeenCalledWith('resetToken', 'resetToken');
      });

      expect(await screen.findByText('Проверьте почту')).toBeInTheDocument();
      expect(
         await screen.findByRole('link', { name: 'Сменить пароль' })
      ).toBeInTheDocument();
   });
});
