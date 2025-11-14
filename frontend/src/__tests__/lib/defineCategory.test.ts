import { describe, test, expect } from 'vitest';
import { defineCategory } from '../../shared/lib/defineCategory';
import { categoryKeywords } from '../../shared/lib/categoryKeywords';

describe('defineCategory', () => {
   test('returns user category if keyword matches', () => {
      const userCategories = { MyCategory: ['Special'] };
      expect(defineCategory('This is special item', userCategories)).toBe('MyCategory');
   });

   test('returns default category if keyword matches categoryKeywords', () => {
      const [firstCategory, keywords] = Object.entries(categoryKeywords)[0];
      const keyword = keywords[0];

      expect(defineCategory(`some text ${keyword} here`)).toBe(firstCategory);
   });

   test('returns Другое if no matches', () => {
      expect(defineCategory('Completely unknown')).toBe('Другое');
   });

   test('is case-insensitive', () => {
      const userCategories = { MyCategory: ['Special'] };
      expect(defineCategory('this is SPECIAL', userCategories)).toBe('MyCategory');
   });
});
