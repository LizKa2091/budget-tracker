import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SetGoalForm from '../../widgets/budget-simulator/ui/SetGoalForm';
import { useAIAdvice } from '../../widgets/budget-simulator/model/useAIAdvice';
import { type IChartItem } from '../../shared/types/charts';

vi.mock('../../widgets/budget-simulator/model/useAIAdvice', () => ({
   useAIAdvice: vi.fn(),
}));

const mockMutateAsync = vi.fn();

describe('SetGoalForm tests', () => {
   const chartData: IChartItem[] = [
      {
         date: '2025-01-01',
         title: 'Продукты',
         amount: 200,
         category: 'Еда',
      },
   ];

   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders form', () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync,
         isPending: false,
         error: null,
      });

      render(<SetGoalForm chartData={chartData} />);

      expect(screen.getByText('Цель по сбережению')).toBeInTheDocument();
      expect(screen.getByText('Введите сумму')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Поставить цель' })).toBeInTheDocument();
   });

   test('displays validation error if the field is empty', async () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync,
         isPending: false,
         error: null,
      });

      render(<SetGoalForm chartData={chartData} />);

      fireEvent.click(screen.getByRole('button', { name: 'Поставить цель' }));

      await waitFor(() => {
         expect(screen.getByText('Введите сумму')).toBeInTheDocument();
      });
   });

   test('sends data and displays AI response', async () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync.mockResolvedValueOnce({
         answer: '*Совет:* копите 10% от дохода',
         }),
         isPending: false,
         error: null,
      });

      render(<SetGoalForm chartData={chartData} />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '1000' } });
      fireEvent.click(screen.getByRole('button', { name: 'Поставить цель' }));

      await waitFor(() => {
         expect(mockMutateAsync).toHaveBeenCalledWith({
         promptType: 'setGoal',
         value: 1000,
         expenses: chartData,
         });
         expect(screen.getByText('Совет: копите 10% от дохода')).toBeInTheDocument();
      });
   });

   test('displays error message if useAIAdvice failed', async () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync,
         isPending: false,
         error: { message: 'Ошибка сети' },
      });

      render(<SetGoalForm chartData={chartData} />);

      expect(screen.getByText('Ошибка: Ошибка сети')).toBeInTheDocument();
   });
});
