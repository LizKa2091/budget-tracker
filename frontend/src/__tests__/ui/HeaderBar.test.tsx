import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthExports from '../../shared/context/AuthContext';
import HeaderBar from '../../widgets/header-bar/HeaderBar';

vi.mock('../../features/theme-switcher/ui/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher">ThemeSwitcher</div>,
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
   const actual = (await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
   ))!;

   return {
      ...actual,
      useNavigate: () => mockNavigate,
   };
});


describe('HeaderBar tests', () => {
   const mockLogout = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders links and button login/register if user is not authed', () => {
      vi.spyOn(AuthExports, 'useAuthContext').mockReturnValue({
         token: null,
         logout: mockLogout,
      } as any);

      render(
         <MemoryRouter>
            <HeaderBar />
         </MemoryRouter>
      );

      expect(screen.getByText('Главная')).toBeInTheDocument();
      expect(screen.getByText('Импорт трат')).toBeInTheDocument();
      expect(screen.getByText('Войти/зарегистрироваться')).toBeInTheDocument();
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
   });

   test('renders logout button if user is authed', () => {
      vi.spyOn(AuthExports, 'useAuthContext').mockReturnValue({
         token: 'fake-token',
         logout: mockLogout,
      } as any);

      render(
         <MemoryRouter>
            <HeaderBar />
         </MemoryRouter>
      );

      expect(screen.getByText('Выйти из профиля')).toBeInTheDocument();
   });

   test('call logout and navigate on logout button click', async () => {
      vi.spyOn(AuthExports, 'useAuthContext').mockReturnValue({
         token: 'fake-token',
         logout: mockLogout,
      } as any);

      render(
         <MemoryRouter>
            <HeaderBar />
         </MemoryRouter>
      );

      const button = screen.getByText('Выйти из профиля');
      fireEvent.click(button);

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
   });

   test('does not call logout if there is no token', () => {
      vi.spyOn(AuthExports, 'useAuthContext').mockReturnValue({
         token: null,
         logout: mockLogout,
      } as any);

      render(
         <MemoryRouter>
            <HeaderBar />
         </MemoryRouter>
      );

      expect(screen.queryByText('Выйти из профиля')).not.toBeInTheDocument();
      expect(mockLogout).not.toHaveBeenCalled();
   });

   it('renders', () => {
      vi.spyOn(AuthExports, 'useAuthContext').mockReturnValue({
         token: null,
         logout: mockLogout,
      } as any);

      render(
         <MemoryRouter>
            <HeaderBar />
         </MemoryRouter>
      );

      expect(screen.getByText('Budget tracker')).toBeInTheDocument();
   });
});
