import { describe, test, expect } from 'vitest';
import { categorizeExpenses } from '../../shared/lib/categorizeExpenses';

describe('categorizeExpenses tests', () => {
   test('categorizes expenses', () => {
      const data = [
         { title: 'Apple', amount: 10, date: '2025-01-01', category: 'Food' },
         { title: 'Orange', amount: 5, date: '2025-01-02', category: 'Food' },
         { title: 'Laptop', amount: 1000, date: '2025-01-02', category: 'Electronics' }
      ];

      const result = categorizeExpenses(data);

      expect(result).toEqual([
         {
         category: 'Food',
         items: [
            { title: 'Apple', amount: 10, date: '2025-01-01' },
            { title: 'Orange', amount: 5, date: '2025-01-02' }
         ]
         },
         {
         category: 'Electronics',
         items: [
            { title: 'Laptop', amount: 1000, date: '2025-01-02' }
         ]
         }
      ]);
   });

   test('asigns Другое category', () => {
      const data = [
         { title: 'Book', amount: 20, date: '2025-01-01' }
      ];

      const result = categorizeExpenses(data);

      expect(result).toEqual([
         {
         category: 'Другое',
         items: [
            { title: 'Book', amount: 20, date: '2025-01-01' }
         ]
         }
      ]);
   });

   test('returns empty array if input data is empty', () => {
      expect(categorizeExpenses([])).toEqual([]);
   });
});
