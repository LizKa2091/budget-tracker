import type { IChartSlot } from "../types/charts";

interface IChartState {
   charts: IChartSlot[];
   userCategories: Record<string, string[]>;
};

export const saveChartsToStorage = (state: IChartState): void => {
   localStorage.setItem('charts', JSON.stringify(state));
};

export const loadChartsFromStorage = (): IChartState | null => {
   const savedCharts = localStorage.getItem('charts');

   return savedCharts ? JSON.parse(savedCharts) : null;
}