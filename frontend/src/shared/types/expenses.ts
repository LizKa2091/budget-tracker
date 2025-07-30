import type { IChartItem } from "./charts";

export interface IExpenseItem {
   date: string;
   title: string;
   amount: number;
}

export interface IExpensesByCategories {
   category: string;
   items: IChartItem[];
}