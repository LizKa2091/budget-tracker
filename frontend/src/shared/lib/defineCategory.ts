import { categoryKeywords } from "./categoryKeywords";

export const defineCategory = (desc: string): string => {
   for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => desc.toLowerCase().includes(keyword))) {
         return category;
      }
   }

   return 'Неизвестно';
};