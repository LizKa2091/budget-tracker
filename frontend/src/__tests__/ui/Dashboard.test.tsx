import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../features/dashboard/ui/Dashboard';
import { useDashboard } from '../../features/dashboard/model/useDashboard';

vi.mock('../../features/dashboard/model/useDashboard', () => ({
   useDashboard: vi.fn()
}));

vi.mock(
   '../../features/chart-mode-switcher/ui/ChartModeSwitcher',
   () => ({
      default: ({ displayMode }: any) => (
         <div data-testid="chart-mode-switcher">
            Mode: {displayMode}
         </div>
      )
   })
);

vi.mock('../../widgets/dashboard/BudgetChart', () => ({
   default: ({ chartId, displayMode }: any) => (
      <div data-testid="budget-chart">
         Chart #{chartId} — {displayMode}
      </div>
   )
}));

describe('Dashboard tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('renders Неверный id диаграммы when isInvalidId = true', () => {
      (useDashboard as vi.Mock).mockReturnValue({
         displayMode: 'default',
         setDisplayMode: vi.fn(),
         allCategories: [],
         categoriesToShow: [],
         setCategoriesToShow: vi.fn(),
         isInvalidId: true,
         paramsId: undefined
      });

      render(<Dashboard />);

      expect(screen.getByText('Неверный id диаграммы')).toBeInTheDocument();
      expect(screen.queryByTestId('chart-mode-switcher')).not.toBeInTheDocument();
      expect(screen.queryByTestId('budget-chart')).not.toBeInTheDocument();
   });

   test('renders ChartModeSwitcher and BudgetChart when id is valid', () => {
      (useDashboard as vi.Mock).mockReturnValue({
         displayMode: 'default',
         setDisplayMode: vi.fn(),
         allCategories: ['Food', 'Tech'],
         categoriesToShow: ['Food'],
         setCategoriesToShow: vi.fn(),
         isInvalidId: false,
         paramsId: '2'
      });

      render(<Dashboard />);

      expect(screen.getByTestId('chart-mode-switcher')).toBeInTheDocument();
      expect(screen.getByText('Mode: default')).toBeInTheDocument();

      expect(screen.getByTestId('budget-chart')).toBeInTheDocument();
      expect(screen.getByText('Chart #2 — default')).toBeInTheDocument();
   });

   test('passes correct props to children', () => {
      const mockSetMode = vi.fn();
      const mockSetCats = vi.fn();

      (useDashboard as vi.Mock).mockReturnValue({
         displayMode: 'pie',
         setDisplayMode: mockSetMode,
         allCategories: ['Food', 'Sport'],
         categoriesToShow: ['Sport'],
         setCategoriesToShow: mockSetCats,
         isInvalidId: false,
         paramsId: '3'
      });

      render(<Dashboard />);

      expect(screen.getByText('Mode: pie')).toBeInTheDocument();
      expect(screen.getByText('Chart #3 — pie')).toBeInTheDocument();
   });
});
