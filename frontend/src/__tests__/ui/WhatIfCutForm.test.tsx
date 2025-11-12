import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, test } from 'vitest';
import WhatIfCutForm from '../../widgets/budget-simulator/ui/WhatIfCutForm';
import { useAIAdvice } from '../../widgets/budget-simulator/model/useAIAdvice';
import { type IChartItem } from '../../shared/types/charts'; 

vi.mock('../../widgets/budget-simulator/model/useAIAdvice', () => ({
   useAIAdvice: vi.fn(),
}));

const mockMutateAsync = vi.fn();

describe('WhatIfCutForm tests', () => {
   const chartData: IChartItem[] = [
      { date: '2025-01-01', title: 'Продукты', amount: 200, category: 'Еда' },
   ];

   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders header and form', () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync,
         isPending: false,
         error: null,
      });

      render(<WhatIfCutForm chartData={chartData} />);

      expect(screen.getByText(/что если сократить траты на/i)).toBeInTheDocument();

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Представить' })).toBeInTheDocument();
   });

   test('sends data and displays AI response', async () => {
      (useAIAdvice as any).mockReturnValue({
            mutateAsync: mockMutateAsync.mockResolvedValueOnce({
            answer: '*Можно сэкономить 500₽*',
         }),
         isPending: false,
         error: null,
      });

      render(<WhatIfCutForm chartData={chartData} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Еда' } });

      fireEvent.click(screen.getByRole('button', { name: 'Представить' }));

      await waitFor(() => {
         expect(mockMutateAsync).toHaveBeenCalledWith({
            promptType: 'cutSpendings',
            value: 'Еда',
            expenses: chartData,
         });

         expect(screen.getByText('Можно сэкономить 500₽')).toBeInTheDocument();
      });
   });

   test('uses default value if the field is empty', async () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync.mockResolvedValueOnce({
            answer: '*В целом можно сэкономить 1000₽*',
         }),
         isPending: false,
         error: null,
      });

      render(<WhatIfCutForm chartData={chartData} />);

      fireEvent.click(screen.getByRole('button', { name: 'Представить' }));

      await waitFor(() => {
         expect(mockMutateAsync).toHaveBeenCalledWith({
            promptType: 'cutSpendings',
            value: 'в целом',
            expenses: chartData,
         });
         expect(screen.getByText('В целом можно сэкономить 1000₽')).toBeInTheDocument();
      });
   });

   test('displays error message if useAIAdvice returns error', () => {
      (useAIAdvice as any).mockReturnValue({
         mutateAsync: mockMutateAsync,
         isPending: false,
         error: { message: 'Ошибка сети' },
      });

      render(<WhatIfCutForm chartData={chartData} />);

      expect(screen.getByText('Ошибка: Ошибка сети')).toBeInTheDocument();
   });
});
