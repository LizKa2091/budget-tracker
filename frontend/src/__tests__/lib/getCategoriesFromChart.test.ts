import { describe, test, expect } from 'vitest';
import { getCategoriesFromChart } from "../../shared/lib/getCategoriesFromChart";

describe('getCategoriesFromChart tests', () => {
   test('returns unique categories from chart', () => {
      const mockChart = {
         categorizedData: [
            { category: 'Food', items: [] },
            { category: 'Transport', items: [] },
            { category: 'Food', items: [] }
         ]
      } as any;

      const result = getCategoriesFromChart(mockChart);
      expect(result).toEqual(['Food', 'Transport']);
   });

   test('returns empty array if no categorizedData', () => {
      const mockChart = { categorizedData: undefined } as any;
      const result = getCategoriesFromChart(mockChart);
      expect(result).toEqual([]);
   });

   test('handles null categorizedData', () => {
      const mockChart = { categorizedData: null } as any;
      const result = getCategoriesFromChart(mockChart);
      expect(result).toEqual([]);
   });
});
