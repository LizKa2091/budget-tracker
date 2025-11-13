import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BudgetSimulator from '../../widgets/budget-simulator/ui/BudgetSimulator';
import type { IChartItem } from '../../shared/types/charts';
import type { IExpensesByCategories } from '../../shared/types/expenses'; 


vi.mock('../../widgets/budget-simulator/ui/SetGoalForm', () => ({
   default: ({ chartData }: { chartData: IChartItem[] | IExpensesByCategories[] }) => (
      <div data-testid="set-goal-form">
         SetGoalForm | items: {chartData.length}
      </div>
   )
}));

vi.mock('../../widgets/budget-simulator/ui/WhatIfCutForm', () => ({
   default: ({ chartData }: { chartData: IChartItem[] | IExpensesByCategories[] }) => (
      <div data-testid="what-if-cut-form">
         WhatIfCutForm | items: {chartData.length}
      </div>
   )
}));

describe('BudgetSimulator tests', () => {
   const mockData: any[] = [
      { name: 'Food', value: 200 },
      { name: 'Transport', value: 100 }
   ];

   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders header', () => {
      render(<BudgetSimulator chartData={mockData} />);

      expect(screen.getByText('Получите совет от нейросети')).toBeInTheDocument();
   });

   test('renders SetGoalForm and WhatIfCutForm', () => {
      render(<BudgetSimulator chartData={mockData} />);

      expect(screen.getByTestId('set-goal-form')).toBeInTheDocument();
      expect(screen.getByTestId('what-if-cut-form')).toBeInTheDocument();
   });

   test('passes chartData to forms', () => {
      render(<BudgetSimulator chartData={mockData} />);

      expect(screen.getByTestId('set-goal-form')).toHaveTextContent('items: 2');
      expect(screen.getByTestId('what-if-cut-form')).toHaveTextContent('items: 2');
   });
});
