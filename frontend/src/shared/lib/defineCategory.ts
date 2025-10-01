import { categoryKeywords } from './categoryKeywords';

export const defineCategory = (
   desc: string,
   userCategories: Record<string, string[]> = {}
): string => {
   const lowerDesc = desc.toLowerCase();

   for (const [category, keywords] of Object.entries(userCategories)) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword.toLowerCase()))) {
         return category;
      }
   }

   for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword.toLowerCase()))) {
         return category;
      }
   }

   return 'Другое';
};
