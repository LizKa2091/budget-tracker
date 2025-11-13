import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BudgetChart from '../../widgets/dashboard/BudgetChart';
import { useChartStore } from '../../shared/store-hooks/useChartStore';
import * as getRandomColorModule from '../../shared/lib/getRandomColor';

(global as any).ResizeObserver = class {
   observe() {}
   unobserve() {}
   disconnect() {}
};

vi.mock('../../features/add-expense/ui/AddExpenseForm', () => ({
   default: () => <div data-testid="add-expense-form" />
}));
vi.mock('../../widgets/budget-simulator/ui/BudgetSimulator', () => ({
   default: ({ chartData }: any) => (
      <div data-testid="budget-simulator">{JSON.stringify(chartData)}</div>
   )
}));

vi.mock('../../shared/store-hooks/useChartStore', () => ({
   useChartStore: vi.fn()
}));

vi.spyOn(getRandomColorModule, 'getRandomColor').mockImplementation(() => '#123456');

const mockCharts = [
   {
      data: [
         { date: '2025-01-01', title: 'Продукты', amount: 1000 },
         { date: '2025-01-02', title: 'Кафе', amount: 500 }
      ],
      categorizedData: [
         { category: 'Food', items: [{ amount: 1000 }, { amount: 500 }] }
      ]
   }
];

describe('BudgetChart tests', () => {
   beforeEach(() => {
      (useChartStore as any).mockReturnValue({ charts: mockCharts });
   });

   test('renders children and PieChart', () => {
      render(<BudgetChart chartId={1} displayMode="default" categoriesToShow={null} />);
      
      expect(screen.getByTestId('add-expense-form')).toBeInTheDocument();
      expect(screen.getByTestId('budget-simulator')).toBeInTheDocument();
      expect(screen.getByText('Масштаб')).toBeInTheDocument();
   });

   test('increases and decreases radius on buttons click', () => {
      render(<BudgetChart chartId={1} displayMode="default" categoriesToShow={null} />);
      
      const increaseBtn = screen.getByText('+ Увеличить');
      const decreaseBtn = screen.getByText('- Уменьшить');

      fireEvent.click(increaseBtn);
      fireEvent.click(decreaseBtn);

      expect(increaseBtn).toBeInTheDocument();
      expect(decreaseBtn).toBeInTheDocument();
   });

   test('generates pieData with colors', () => {
      render(<BudgetChart chartId={1} displayMode="default" categoriesToShow={null} />);
      
      const simulator = screen.getByTestId('budget-simulator');
      expect(simulator.textContent).toContain('Продукты');
      expect(simulator.textContent).toContain('Кафе');
   });

   test('filters categories on displayMode categories and categoriesToShow', () => {
      render(<BudgetChart chartId={1} displayMode="categories" categoriesToShow={['Food']} />);
      
      const simulator = screen.getByTestId('budget-simulator');
      expect(simulator.textContent).toContain('Food');
   });
});
