import { describe, test, expect } from 'vitest';
import { extractExpFromJson } from './../../shared/lib/extractExpFromJson';

describe('extractExpFromJson tests', () => {
   test('extracts expenses correctly from valid JSON', () => {
      const mockData = {
         result: {
            document: {
               page: [
                  {
                     row: [
                        { column: [{ text: { '#text': '2025-01-01' } }, {}, { text: { '#text': 'Apple' } }, { text: { '#text': '10,5' } }] },
                        { column: [{ text: { '#text': '2025-01-02' } }, {}, { text: { '#text': 'Banana' } }, { text: { '#text': '−5' } }] }
                     ]
                  }
               ]
            }
         }
      };

      const result = extractExpFromJson(mockData);
      expect(result).toEqual([
         { date: '2025-01-01', title: 'Apple', amount: 10.5 },
         { date: '2025-01-02', title: 'Banana', amount: -5 }
      ]);
   });

   test('returns empty array if no pages', () => {
      const mockData = { result: { document: {} } };
      const result = extractExpFromJson(mockData);
      expect(result).toEqual([]);
   });

   test('skips rows with missing or invalid data', () => {
      const mockData = {
         result: {
         document: {
            page: [
               { row: [{ column: [{ text: { '#text': '' } }, {}, { text: { '#text': 'Title' } }, { text: { '#text': 'abc' } }] }] }
            ]
         }
         }
      };
      const result = extractExpFromJson(mockData);
      expect(result).toEqual([]);
   });
});