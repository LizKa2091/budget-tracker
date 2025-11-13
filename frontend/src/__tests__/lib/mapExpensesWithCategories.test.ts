import { describe, test, expect, vi } from 'vitest';
import { mapExpensesWithCategories } from './../../features/import-pdf/lib/mapExpensesWithCategories';
import * as defineCategoryModule from '../../shared/lib/defineCategory';

describe('mapExpensesWithCategories tests', () => {
   test('maps expenses with default categories', () => {
      const expenses = [{ title: 'Apple', amount: 10, date: '2025-11-13' }];
      vi.spyOn(defineCategoryModule, 'defineCategory').mockReturnValue('Food');

      const result = mapExpensesWithCategories(expenses);
      expect(result).toEqual([{ title: 'Apple', amount: 10, date: '2025-11-13', category: 'Food' }]);
   });

   test('maps expenses with userCategories', () => {
      const expenses = [{ title: 'Laptop', amount: 1000, date: '2025-11-13' }];
      const userCategories = { Electronics: ['Laptop'] };
      vi.spyOn(defineCategoryModule, 'defineCategory').mockReturnValue('Electronics');

      const result = mapExpensesWithCategories(expenses, userCategories);
      expect(result).toEqual([{ title: 'Laptop', amount: 1000, date: '2025-11-13', category: 'Electronics' }]);
   });

   test('returns empty array if no items', () => {
      const result = mapExpensesWithCategories([]);
      expect(result).toEqual([]);
   });
});