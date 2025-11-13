import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '@/features/auth/ui/RegisterForm/RegisterForm';
import * as AuthContextModule from '@/shared/context/AuthContext';

vi.mock('@/shared/context/AuthContext', () => {
   const mockRegister = vi.fn();
   const mockUseAuthContext = vi.fn(() => ({
      register: mockRegister,
      isRegistering: false,
   }));

   return {
      __esModule: true,
      default: {
         useAuthContext: mockUseAuthContext,
      },
      mockRegister,
      mockUseAuthContext,
   };
});

describe('RegisterForm tests', () => {
   const { mockRegister, mockUseAuthContext } = AuthContextModule;

   beforeEach(() => {
      vi.clearAllMocks();
      mockUseAuthContext.mockReturnValue({
         register: mockRegister,
         isRegistering: false,
      });
   });

   test('renders form with fields', () => {
      render(<RegisterForm />);

      expect(screen.getByText('Регистрация')).toBeInTheDocument();
      expect(screen.getByText('Почта')).toBeInTheDocument();
      expect(screen.getByText('Повторите пароль')).toBeInTheDocument();
      expect(screen.getByText('Имя')).toBeInTheDocument();
   });

   test('validates password and password repeat', async () => {
      render(<RegisterForm />);

      const inputs = screen.getAllByRole('textbox');
      const email = inputs[0];
      const name = inputs[1];
      const button = screen.getByRole('button', { name: 'Зарегистрироваться' });

      const password = document.querySelector('input[name="password"]') as HTMLInputElement;
      const passwordRepeat = document.querySelector('input[name="passwordRepeat"]') as HTMLInputElement;

      fireEvent.change(email, { target: { value: 'user@gmail.com' } });
      fireEvent.change(password, { target: { value: '123456' } });
      fireEvent.change(passwordRepeat, { target: { value: '654321' } });
      fireEvent.change(name, { target: { value: 'Alex' } });
      fireEvent.click(button);

      await waitFor(() => {
         expect(screen.getByText('Пароли должны совпадать')).toBeInTheDocument();
      });
   });

   test('success register', async () => {
      mockRegister.mockResolvedValueOnce({ message: 'Регистрация успешна' });
      render(<RegisterForm />);

      const email = document.querySelector('input[name="email"]') as HTMLInputElement;
      const name = document.querySelector('input[name="name"]') as HTMLInputElement;
      const password = document.querySelector('input[name="password"]') as HTMLInputElement;
      const passwordRepeat = document.querySelector('input[name="passwordRepeat"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: 'Зарегистрироваться' });

      fireEvent.change(email, { target: { value: 'user@gmail.com' } });
      fireEvent.change(password, { target: { value: '123456' } });
      fireEvent.change(passwordRepeat, { target: { value: '123456' } });
      fireEvent.change(name, { target: { value: 'Alex' } });
      fireEvent.click(button);

      await waitFor(() => {
         expect(mockRegister).toHaveBeenCalledWith('user@gmail.com', '123456', 'Alex');
         expect(screen.getByText('Регистрация успешна')).toBeInTheDocument();
      });
   });

   test('register errro', async () => {
      mockRegister.mockResolvedValueOnce(new Error('Ошибка регистрации'));
      render(<RegisterForm />);

      const email = document.querySelector('input[name="email"]') as HTMLInputElement;
      const name = document.querySelector('input[name="name"]') as HTMLInputElement;
      const password = document.querySelector('input[name="password"]') as HTMLInputElement;
      const passwordRepeat = document.querySelector('input[name="passwordRepeat"]') as HTMLInputElement;
      const button = screen.getByRole('button', { name: 'Зарегистрироваться' });

      fireEvent.change(email, { target: { value: 'user@gmail.com' } });
      fireEvent.change(password, { target: { value: '123456' } });
      fireEvent.change(passwordRepeat, { target: { value: '123456' } });
      fireEvent.change(name, { target: { value: 'Alex' } });
      fireEvent.click(button);

      await waitFor(() => {
         expect(mockRegister).toHaveBeenCalledWith('user@gmail.com', '123456', 'Alex');
         expect(screen.getByText('Ошибка регистрации')).toBeInTheDocument();
      });
   });
});
