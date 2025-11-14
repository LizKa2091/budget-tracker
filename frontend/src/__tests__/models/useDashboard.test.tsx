import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from '../../pages/DashBoardPage/model/useDashboard';
import { useChartStore } from '../../shared/store-hooks/useChartStore'; 
import { getCategoriesFromChart } from '../../shared/lib/getCategoriesFromChart';
import { useParams } from 'react-router-dom';

vi.mock('../../shared/store-hooks/useChartStore');
vi.mock('../../shared/lib/getCategoriesFromChart');
vi.mock('react-router-dom', () => ({
   useParams: vi.fn()
}));

describe('useDashboard tests', () => {
   const mockCharts = [
      { id: 1, name: 'Chart 1', data: [] },
      { id: 2, name: 'Chart 2', data: [] }
   ];

   beforeEach(() => {
      (useChartStore as any).mockReturnValue({ charts: mockCharts });
   });

   test('returns undefined chart and invalid id if paramsId missing', () => {
      (useParams as any).mockReturnValue({});
      const { result } = renderHook(() => useDashboard());

      expect(result.current.isInvalidId).toBe(true);
   });

   test('returns current chart and categories when paramsId is valid', () => {
      (useParams as any).mockReturnValue({ id: '1' });
      (getCategoriesFromChart as any).mockReturnValue(['Food', 'Transport']);

      const { result } = renderHook(() => useDashboard());

      expect(result.current.allCategories).toEqual(['Food', 'Transport']);
      expect(result.current.categoriesToShow).toEqual(['Food', 'Transport']);
      expect(result.current.isInvalidId).toBe(false);
   });

   test('sets displayMode and categoriesToShow correctly', () => {
      (useParams as any).mockReturnValue({ id: '2' });
      (getCategoriesFromChart as any).mockReturnValue(['Electronics']);

      const { result } = renderHook(() => useDashboard());

      act(() => {
         result.current.setDisplayMode('categories');
         result.current.setCategoriesToShow(['Electronics']);
      });

      expect(result.current.displayMode).toBe('categories');
      expect(result.current.categoriesToShow).toEqual(['Electronics']);
   });

   test('marks invalid id if out of range', () => {
      (useParams as any).mockReturnValue({ id: '5' });
      const { result } = renderHook(() => useDashboard());
      expect(result.current.isInvalidId).toBe(true);
   });
});
