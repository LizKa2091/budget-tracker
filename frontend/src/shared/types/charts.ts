import type { IExpensesByCategories } from "./expenses";

export interface IChartSlot {
   id: number;
   data: IChartItem[] | null;
   categorizedData?: IExpensesByCategories[] | null;
}

export interface IChartItem {
   date: string;
   title: string;
   amount: number;
   category?: string;
}

export type ChartMode = 'categories' | 'default';