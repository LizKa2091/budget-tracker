import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../../features/theme-switcher/ui/ThemeSwitcher';
import ThemeExports from '../../shared/context/ThemeContext';

const { useTheme } = ThemeExports;

vi.mock('../../shared/context/ThemeContext', () => {
   return {
      default: {
         useTheme: vi.fn()
      }
   };
});

describe('ThemeSwitcher tests', () => {
   const mockSwitchTheme = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('displays icon sun if curr theme is light', () => {
      (useTheme as vi.Mock).mockReturnValue({
         theme: 'light',
         switchTheme: mockSwitchTheme,
      });

      render(<ThemeSwitcher />);

      expect(screen.getByRole('img', { name: 'sun' })).toBeInTheDocument();
   });

   test('displays icon moon if curr theme is dark', () => {
      (useTheme as vi.Mock).mockReturnValue({
         theme: 'dark',
         switchTheme: mockSwitchTheme,
      });

      render(<ThemeSwitcher />);

      expect(screen.getByRole('img', { name: 'moon' })).toBeInTheDocument();
   });

   test('calls switchTheme on click', () => {
      (useTheme as vi.Mock).mockReturnValue({
         theme: 'light',
         switchTheme: mockSwitchTheme,
      });

      render(<ThemeSwitcher />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockSwitchTheme).toHaveBeenCalledTimes(1);
   });
});
