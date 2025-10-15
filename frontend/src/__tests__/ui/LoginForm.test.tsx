import { describe, test, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../features/auth/ui/LoginForm/LoginForm';
import AuthExports from '../../shared/context/AuthContext';

vi.mock('../../shared/context/AuthContext', () => ({
   default: {
      useAuthContext: vi.fn()
   }
}));

describe('LoginForm tests', () => {
   const loginMock = vi.fn();

   (AuthExports.useAuthContext as unknown as vi.Mock).mockReturnValue({
      login: loginMock,
      isLogining: false
   });

   test('renders form fields and submit button', () => {
      render(<LoginForm />);

      expect(screen.getByText('Вход')).toBeInTheDocument();
      expect(document.querySelector('input[name="email"]')).toBeInTheDocument();
      expect(
         document.querySelector('input[name="password"]')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
   });

   test('shows validation error for invalid email', async () => {
      render(<LoginForm />);

      const emailInput = document.querySelector<HTMLInputElement>(
         'input[name="email"]'
      )!;
      await userEvent.type(emailInput, 'invalid-email');

      const button = screen.getByRole('button', { name: 'Войти' });
      await userEvent.click(button);

      expect(
         await screen.findByText('Неверный формат почты')
      ).toBeInTheDocument();
   });

   test('displays error message if login fails', async () => {
      loginMock.mockResolvedValueOnce(new Error('Неверный логин или пароль'));

      render(<LoginForm />);

      const emailInput = document.querySelector<HTMLInputElement>(
         'input[name="email"]'
      )!;
      const passwordInput = document.querySelector<HTMLInputElement>(
         'input[name="password"]'
      )!;
      await userEvent.type(emailInput, 'user@gmail.com');
      await userEvent.type(passwordInput, '123456');

      const button = screen.getByRole('button', { name: 'Войти' });
      await userEvent.click(button);

      await waitFor(() => {
         expect(loginMock).toHaveBeenCalledWith('user@hmail.com', '123456');
      });

      expect(
         await screen.findByText('Неверный логин или пароль')
      ).toBeInTheDocument();
      expect(screen.getByText('Неверный логин или пароль')).toHaveClass(
         'failed-response'
      );
   });

   test('displays success message if login succeeds', async () => {
      loginMock.mockResolvedValueOnce({ message: 'Успешный вход' });

      render(<LoginForm />);

      const emailInput = document.querySelector<HTMLInputElement>(
         'input[name="email"]'
      )!;
      const passwordInput = document.querySelector<HTMLInputElement>(
         'input[name="password"]'
      )!;
      await userEvent.type(emailInput, 'user@gmail.com');
      await userEvent.type(passwordInput, '123456');

      const button = screen.getByRole('button', { name: 'Войти' });
      await userEvent.click(button);

      await waitFor(() => {
         expect(loginMock).toHaveBeenCalledWith('user@gmail.com', '123456');
      });

      expect(await screen.findByText('Успешный вход')).toBeInTheDocument();
      expect(screen.getByText('Успешный вход')).toHaveClass('success-response');
   });

   test('submit button shows loading state', () => {
      (AuthExports.useAuthContext as unknown as vi.Mock).mockReturnValue({
         login: loginMock,
         isLogining: true
      });

      render(<LoginForm />);
      const button = screen.getByRole('button', { name: /войти/i });
      expect(button.querySelector('.ant-btn-loading-icon')).toBeInTheDocument();
   });
});
