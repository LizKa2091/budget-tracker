import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ChartSlots from '../../features/chart-slots/ui/ChartSlots';

vi.mock('react-router-dom', () => ({
   Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

vi.mock('antd', async () => {
   const actual = await vi.importActual<typeof import('antd')>('antd');
   
   return {
      ...actual,
      Flex: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
      Card: ({ children, title, extra }: any) => (
         <div>
            <h3>{title}</h3>
               {extra}
            <div>{children}</div>
         </div>
      ),
      Button: ({ onClick, children, ...rest }: any) => (
         <button onClick={onClick} {...rest}>
            {children}
         </button>
      ),
   };
});

const mockRemoveChart = vi.fn();
let mockCharts: { id: number; name: string; data: { date: string; amount: number; }[]; }[] | { id: number; name: string; data: { date: string; }[]; }[] | ({ id: number; name: string; data: never[]; } | { id: number; name: string; data?: undefined; })[] = [];

vi.mock('../../shared/store-hooks/useChartStore', () => ({
   useChartStore: () => ({
      charts: mockCharts,
      removeChart: mockRemoveChart,
   }),
}));

describe('ChartSlots', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('displays message if no saved charts', () => {
      mockCharts = [];
      render(<ChartSlots />);

      expect(screen.getByText('У вас пока нет сохранённых диаграмм')).toBeInTheDocument();
      expect(screen.getByText('Импортировать выписку за месяц в pdf формате')).toBeInTheDocument();
   });

   test('displays saved charts', () => {
      mockCharts = [
         {
            id: 1,
            name: 'Расходы за октябрь',
            data: [{ date: '2025-10-01', amount: 100 }],
         },
         {
            id: 2,
            name: 'Доходы за сентябрь',
            data: [{ date: '2025-09-15', amount: 200 }],
         },
      ];

      render(<ChartSlots />);

      expect(screen.getByText('Ваши сохранённые слоты')).toBeInTheDocument();
      expect(screen.getByText('Расходы за октябрь')).toBeInTheDocument();
      expect(screen.getByText('Доходы за сентябрь')).toBeInTheDocument();

      expect(screen.getByText('Дата первой траты: 2025-10-01')).toBeInTheDocument();
   });

   test('link "Перейти к диаграмме"', () => {
      mockCharts = [
         {
            id: 3,
            name: 'Тестовая диаграмма',
            data: [{ date: '2025-11-01', amount: 300 }],
         },
      ];

      render(<ChartSlots />);

      const link = screen.getByRole('link', { name: 'Перейти к диаграмме' });
      
      expect(link).toHaveAttribute('href', '/dashboard/3');
   });

   test('click on button calls removeChart', () => {
      mockCharts = [
         {
            id: 10,
            name: 'Удаляемая диаграмма',
            data: [{ date: '2025-11-01' }],
         },
      ];

      render(<ChartSlots />);

      const delButton = screen.getByRole('button', { name: 'Удалить' });
      fireEvent.click(delButton);

      expect(mockRemoveChart).toHaveBeenCalledWith(10);
   });

   test('does not display cards if chart has no data', () => {
      mockCharts = [
         { id: 1, name: 'Пустая диаграмма', data: [] },
         { id: 2, name: 'Нет поля data' },
      ];

      render(<ChartSlots />);

      expect(screen.getByText('У вас пока нет сохранённых диаграмм')).toBeInTheDocument();
   });
});
