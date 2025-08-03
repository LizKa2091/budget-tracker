import type { IChartItem } from "../types/charts";
import type { IExpensesByCategories } from "../types/expenses";
import { categoryKeywords } from "./categoryKeywords";

export const categorizeExpenses = (data: IChartItem[], userCategories: Record<string, string[]>) => {
   const categorizedMap: Record<string, IChartItem[]> = {};

   const defineCategory = (title: string): string => {
      const lowerTitle = title.toLowerCase();

      for (const [category, keywords] of Object.entries(userCategories)) {
         if (keywords.some(keyword => lowerTitle.includes(keyword.toLowerCase()))) {
            return category;
         }
      }

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
         if (keywords.some(keyword => lowerTitle.includes(keyword.toLowerCase()))) {
            return category;
         }
      }

      return 'Другое';
   };

   for (const chartItem of data) {
      let category = chartItem.category;

      if (!category) category = defineCategory(chartItem.title);

      if (!categorizedMap[category]) categorizedMap[category] = [];

      categorizedMap[category].push(chartItem);
   }

   const expensesByCategories: IExpensesByCategories[] = Object.entries(categorizedMap).map(
      ([category, items]) => ({ category, items: items.map(({ date, title, amount }) => ({ date, title, amount })) })
   );

   return expensesByCategories;
};
