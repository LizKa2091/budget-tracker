import type { IChartItem } from "../types/charts";
import type { IExpensesByCategories } from "../types/expenses";
import { categoryKeywords } from "./categoryKeywords";

export const categorizeExpenses = (data: IChartItem[]) => {
   const expensesByCategories: IExpensesByCategories[] = [];

   for (const category of Object.keys(categoryKeywords)) {
      const currCategoryData: IExpensesByCategories = { category, items: [] };

      for (const chartItem of data) {
         if (chartItem.category === category) {
            currCategoryData.items.push({ date: chartItem.date, title: chartItem.title, amount: chartItem.amount });
         }
      }
      
      if (currCategoryData.items.length > 0) {
         expensesByCategories.push(currCategoryData);
      }
   }

   console.log(expensesByCategories);
   return expensesByCategories;
};
