import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../../features/home/ui/Home';
import { useChartStore } from '../../shared/store-hooks/useChartStore';

vi.mock('../../shared/store-hooks/useChartStore', () => ({
   useChartStore: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
   Link: ({ to, children }: any) => (
      <a data-testid="mock-link" href={to}>
         {children}
      </a>
   ),
}));

describe('Home tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders message when no charts exist', () => {
      (useChartStore as vi.Mock).mockReturnValue({
         charts: [],
      });

      render(<Home />);

      expect(
         screen.getByText(
            'Пока нет сохранённых диаграмм. Начните с импорта PDF или добавления расходов'
         )
      ).toBeInTheDocument();
   });

   test('renders last chart statistics when chart exists', () => {
      (useChartStore as vi.Mock).mockReturnValue({
         charts: [
            {
               id: 1,
               name: 'Мой бюджет',
               data: [
                  { title: 'Еда', amount: 200 },
                  { title: 'Техника', amount: 1500 },
               ],
            },
         ],
      });

      render(<Home />);

      expect(screen.getByText('Ваша последняя сохранённая диаграмма: Мой бюджет')).toBeInTheDocument();

      expect(screen.getByText(/1,700/)).toBeInTheDocument();

      expect(screen.getByText('Техника')).toBeInTheDocument();

      expect(screen.getByText(/1,500/)).toBeInTheDocument();
   });

   test('handles multiple charts and selects the last one', () => {
      (useChartStore as vi.Mock).mockReturnValue({
         charts: [
            {
               id: 1,
               name: 'Первый',
               data: [{ title: 'Кофе', amount: 200 }],
            },
            {
               id: 2,
               name: 'Второй',
               data: [
                  { title: 'Такси', amount: 500 },
                  { title: 'Еда', amount: 350 },
               ],
            },
         ],
      });

      render(<Home />);

      expect(
         screen.getByText('Ваша последняя сохранённая диаграмма: Второй')
      ).toBeInTheDocument();

      expect(screen.getByText('850')).toBeInTheDocument();

      expect(screen.getByText('Такси')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
   });

   test('renders cards and their links', () => {
      (useChartStore as vi.Mock).mockReturnValue({
         charts: [],
      });

      render(<Home />);

      expect(screen.getByText('Импортировать PDF')).toBeInTheDocument();
      expect(screen.getByText('Дашборд')).toBeInTheDocument();
      expect(screen.getByText('Эксперименты')).toBeInTheDocument();

      const links = screen.getAllByTestId('mock-link').map((a) => a.getAttribute('href'));

      expect(links).toContain('/import-pdf');
      expect(links).toContain('/dashboard');
   });
});
