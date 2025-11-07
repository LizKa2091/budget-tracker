import { render, screen, fireEvent } from '@testing-library/react';
import ChartModeSwitcher from '../../features/chart-mode-switcher/ui/ChartModeSwitcher';
import { describe, test, expect, vi } from 'vitest';

vi.mock('antd', async () => {
   const actual = await vi.importActual<typeof import('antd')>('antd');
   
   return {
      ...actual,
      Flex: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
   };
});

describe('ChartModeSwitcher tests', () => {
   const mockSetDisplayMode = vi.fn();
   const mockSetCategoriesToShow = vi.fn();
   const allCategories = ['Еда', 'Транспорт', 'Развлечения'];

   const setup = (props = {}) => {
      return render(
         <ChartModeSwitcher
         displayMode="default"
         setDisplayMode={mockSetDisplayMode}
         allCategories={allCategories}
         categoriesToShow={['Еда']}
         setCategoriesToShow={mockSetCategoriesToShow}
         {...props}
         />
      );
   };

   test('renders with header and switchers', () => {
      setup();
      expect(screen.getByText('Показывать все траты')).toBeInTheDocument();
      expect(screen.getByText('Без категорий')).toBeInTheDocument();
      expect(screen.getByText('По категориям')).toBeInTheDocument();
   });

   test('on click "По категориям" calls setDisplayMode("categories")', () => {
      setup();

      const segmented = screen.getByText('По категориям');
      fireEvent.click(segmented);

      expect(mockSetDisplayMode).toHaveBeenCalledWith('categories');
   });

   test('displays checkboxes if displayMode="categories"', () => {
      setup({ displayMode: 'categories' });

      expect(screen.getByText('Показать категорию')).toBeInTheDocument();
      
      allCategories.forEach(cat => {
         expect(screen.getByText(cat)).toBeInTheDocument();
      });
   });

   test('on checkbox click adds category', () => {
      setup({ displayMode: 'categories', categoriesToShow: [] });

      const checkbox = screen.getByText('Еда').closest('label')?.querySelector('input');
      fireEvent.click(checkbox!);

      expect(mockSetCategoriesToShow).toHaveBeenCalledWith(['Еда']);
   });

   test('on checkbox off removes category', () => {
      setup({ displayMode: 'categories', categoriesToShow: ['Еда', 'Транспорт'] });
      
      const checkbox = screen.getByText('Еда').closest('label')?.querySelector('input');
      fireEvent.click(checkbox!);
      
      expect(mockSetCategoriesToShow).toHaveBeenCalledWith(['Транспорт']);
   });
});
