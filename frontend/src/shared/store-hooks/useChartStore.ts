import { useAppDispatch, useAppSelector } from './useReduxStore';
import { addExpense, removeChart, addChartThunk } from "../../features/chart-store/chartSlice";
import type { IChartItem } from '../types/charts';

export const useChartStore = () => {
   const dispatch = useAppDispatch();
   const charts = useAppSelector(state => state.charts.charts);
   const userCategories = useAppSelector(state => state.charts.userCategories);

   return {
      charts, userCategories,
      addChart: (newSlotData: IChartItem[], chartName: string) => 
         dispatch(addChartThunk({ newSlotData, chartName })),
      removeChart: (slotId: number) => dispatch(removeChart({ slotId })),
      addExpense: (payload: { chartId: number; category: string; date: string; title: string; amount: number }) =>
         dispatch(addExpense(payload))
   }
}