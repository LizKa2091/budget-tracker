import '@testing-library/jest-dom';
import dayjs from 'dayjs';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddExpenseForm from '../../features/add-expense/ui/AddExpenseForm';
import { useChartStore } from '../../shared/store-hooks/useChartStore';

vi.mock('../../shared/store-hooks/useChartStore', () => ({
   useChartStore: vi.fn()
}));

vi.mock('antd', async (importOriginal) => {
   const actualAntd = await importOriginal<typeof import('antd')>();
   return {
      ...actualAntd,
      DatePicker: ({ onChange, value, ...rest }: any) => (
         <input
            type="date"
            data-testid="date-input"
            value={value || ''}
            onChange={(e) =>
               onChange?.(dayjs(e.target.value).startOf('day'), e.target.value)
            }
            {...rest}
         />
      )
   };
});

describe('addExpenseForm tests', () => {
   const mockUseChartStore = vi.fn();
   const testChartId = 1;

   beforeEach(() => {
      vi.clearAllMocks();
      (useChartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
         addExpense: mockUseChartStore
      });
   });

   test('calls addExpense with correct data', async () => {
      render(<AddExpenseForm chartId={testChartId} />);

      const titleInput = screen.getByTestId('title-input');
      const categoryInput = screen.getByTestId('category-input');
      const amountInput = screen.getByTestId('amount-input');
      const dateInput = screen.getByTestId('date-input');

      await userEvent.type(titleInput, 'Булочка с корицей');
      await userEvent.type(categoryInput, 'Продукты');

      fireEvent.change(amountInput, { target: { value: '70' } });
      fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

      const submitBtn = screen.getByRole('button', { name: 'Добавить' });

      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mockUseChartStore).toHaveBeenCalledTimes(1);
         expect(mockUseChartStore).toHaveBeenCalledWith(
            expect.objectContaining({
               chartId: 1,
               title: 'Булочка с корицей',
               category: 'Продукты',
               amount: 70,
               date: expect.any(String)
            })
         );
      });
   });
});
