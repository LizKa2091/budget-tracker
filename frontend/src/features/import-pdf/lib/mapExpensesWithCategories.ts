import { defineCategory } from "../../../shared/lib/defineCategory";
import type { IExpenseItem } from "../../../shared/types/expenses";
import type { IChartItem } from "../../../shared/types/charts";

export const mapExpensesWithCategories = (items: IExpenseItem[]): IChartItem[] => {
   return items.map(item => ({ ...item, category: defineCategory(item.title) }));
};