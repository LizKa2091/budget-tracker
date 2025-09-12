import type { IChartItem } from "../../shared/types/charts";
import type { IExpensesByCategories } from "../../shared/types/expenses";

export interface IAddChartThunkArgs {
   newSlotData: IChartItem[];
   chartName: string;
};

export interface IAddChartThunkResponse {
   newSlotData: IChartItem[];
   chartName: string;
   categorizedData: IExpensesByCategories[] | null;
};

export interface IAddExpensePayload {
   chartId: number;
   category: string;
   date: string;
   title: string;
   amount: number;
};