import '@testing-library/jest-dom';

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AuthSwitcher from '../../features/auth/ui/AuthSwitcher/AuthSwitcher';

vi.mock('../../features/auth/ui/LoginForm/LoginForm', () => ({
   default: () => <div data-testid="login-form">Login Form</div>,
}));
vi.mock('../../features/auth/ui/RegisterForm/RegisterForm', () => ({
   default: () => <div data-testid="register-form">Register Form</div>,
}));
vi.mock('../../features/auth/ui/ForgotPassForm/ForgotPassForm', () => ({
   default: () => <div data-testid="forgotpass-form">Forgot Form</div>,
}));

describe('AuthSwitcher tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders login form in default case', () => {
      render(<AuthSwitcher />);
      expect(screen.getByTestId('login-form')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Нет аккаунта? Зарегистрироваться' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Восстановить пароль' })).toBeInTheDocument();
   });

   test('switches to register form after clicking register button', async () => {
      render(<AuthSwitcher />);
      
      const registerBtn = screen.getByRole('button', { name: 'Нет аккаунта? Зарегистрироваться' });

      await userEvent.click(registerBtn);

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Уже есть аккаунт? Войти' })).toBeInTheDocument();
   });

   test('switches to frogot pass form after clicking reset pass button', async () => {
      render(<AuthSwitcher />);
      const forgotPassBtn = screen.getByRole('button', {
         name: 'Восстановить пароль'
      });

      await userEvent.click(forgotPassBtn);

      expect(screen.getByTestId('forgotpass-form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Вернуться ко входу в аккаунт' })).toBeInTheDocument();
   });
})