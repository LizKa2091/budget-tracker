import type { IChartItem } from '../types/charts';
import type { IExpensesByCategories } from '../types/expenses';

export const categorizeExpenses = (
   data: IChartItem[]
): IExpensesByCategories[] => {
   const categorizedMap: Record<string, IChartItem[]> = {};

   for (const chartItem of data) {
      const category = chartItem.category ?? 'Другое';

      if (!categorizedMap[category]) categorizedMap[category] = [];
      categorizedMap[category].push(chartItem);
   }

   return Object.entries(categorizedMap).map(([category, items]) => ({
      category,
      items: items.map(({ date, title, amount }) => ({ date, title, amount }))
   }));
};
