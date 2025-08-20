import type { IChartSlot } from "../types/charts";
import type { IExpensesByCategories } from "../types/expenses";

export const getCategoriesFromChart = (chart: IChartSlot): string[] => {
   if (!chart?.categorizedData) return [];

   const allCategories: string[] = [];
   const currCategorizedData: IExpensesByCategories[] | null | undefined = chart.categorizedData;

   if (currCategorizedData) {
      for (const item of currCategorizedData) {
         if (!allCategories.includes(item.category)) allCategories.push(item.category);
      }
   }

   return allCategories;
};