import '@testing-library/jest-dom';
import dayjs from 'dayjs';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddExpenseForm from '../../features/add-expense/ui/AddExpenseForm';
import { useChartStore } from '../../shared/store-hooks/useChartStore';

vi.mock('../../shared/store-hooks/useChartStore', () => ({
   useChartStore: vi.fn()
}));

vi.mock('antd', async (importOriginal) => {
   const actual = await importOriginal<typeof import('antd')>();
   return {
      ...actual,
      DatePicker: ({ value, onChange, ...rest }: any) => (
         <input
            type="date"
            data-testid="date-input"
            value={value || ''}
            onChange={(e) =>
               onChange?.(dayjs(e.target.value).startOf('day'), e.target.value)
            }
            {...rest}
         />
      ),
   };
});

describe('AddExpenseForm', () => {
   const addExpenseMock = vi.fn();

   beforeEach(() => {
      vi.clearAllMocks();

      (useChartStore as any).mockReturnValue({
         addExpense: addExpenseMock
      });
   });

   test('calls addExpense with correct data', async () => {
      render(<AddExpenseForm chartId={10} />);

      fireEvent.change(screen.getByTestId('title-input'), {
         target: { value: 'Еда' }
      });
      fireEvent.change(screen.getByTestId('category-input'), {
         target: { value: 'Продукты' }
      });
      fireEvent.change(screen.getByTestId('amount-input'), {
         target: { value: '500' }
      });
      fireEvent.change(screen.getByTestId('date-input'), {
         target: { value: '2025-01-01' }
      });

      fireEvent.click(screen.getByRole('button', { name: /добавить/i }));

      await waitFor(() => {
         expect(addExpenseMock).toHaveBeenCalledTimes(1);
         expect(addExpenseMock).toHaveBeenCalledWith({
            chartId: 10,
            category: 'Продукты',
            date: dayjs('2025-01-01').startOf('day').toISOString(),
            title: 'Еда',
            amount: 500
         });
      });
   });
});
