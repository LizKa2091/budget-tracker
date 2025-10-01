import {
   createAsyncThunk,
   createSlice,
   type PayloadAction
} from '@reduxjs/toolkit';
import { categorizeExpenses } from '../../shared/lib/categorizeExpenses';
import type { IChartSlot } from '../../shared/types/charts';
import { categoryKeywords } from '../../shared/lib/categoryKeywords';
import type { RootState } from './index';
import { saveChartsToStorage } from '../../shared/lib/chartsLocalStorage';
import type {
   IAddChartThunkArgs,
   IAddChartThunkResponse,
   IAddExpensePayload
} from './chartStoreTypes';

interface IChartState {
   charts: IChartSlot[];
   userCategories: Record<string, string[]>;
}

const savedState = localStorage.getItem('charts');
const initialState: IChartState = savedState
   ? JSON.parse(savedState)
   : {
        charts: [
           { id: 1, name: null, data: null },
           { id: 2, name: null, data: null },
           { id: 3, name: null, data: null },
           { id: 4, name: null, data: null }
        ],
        userCategories: {}
     };

const chartSlice = createSlice({
   name: 'charts',
   initialState,
   reducers: {
      removeChart(state, action) {
         const { slotId } = action.payload;
         if (slotId > 4 || slotId < 0) return;

         state.charts = state.charts.map((slot) =>
            slot.id === slotId
               ? { ...slot, data: null, categorizedData: null, name: null }
               : slot
         );

         saveChartsToStorage(state);
      },
      addExpense(state, action: PayloadAction<IAddExpensePayload>) {
         const { chartId, category, date, title, amount } = action.payload;
         const chart = state.charts.find((chart) => chart.id === chartId);

         if (!chart || !chart.data) return;

         const updatedChartData = [
            ...chart.data,
            { date, title, amount, category }
         ];
         chart.data = updatedChartData;
         chart.categorizedData = categorizeExpenses(updatedChartData);

         const newCategory = category.trim().toLowerCase();

         const isExistingCategory = Object.keys(categoryKeywords).some(
            (category) => category.toLowerCase() === newCategory
         );
         const isUserCategory = Object.keys(state.userCategories).some(
            (category) => category.toLowerCase() === newCategory
         );

         if (!isExistingCategory && !isUserCategory) {
            state.userCategories[category] = [];
         }

         saveChartsToStorage(state);
      }
   },
   extraReducers: (builder) => {
      builder.addCase(addChartThunk.fulfilled, (state, action) => {
         const { newSlotData, chartName, categorizedData } = action.payload;

         if (!state.charts || !Array.isArray(state.charts)) {
            state.charts = initialState.charts;
         }

         const emptyDataIndex = state.charts.findIndex(
            (slot) => slot.data === null
         );

         if (emptyDataIndex !== -1) {
            state.charts = state.charts.map((slot, index) => {
               return index === emptyDataIndex
                  ? {
                       ...slot,
                       data: newSlotData,
                       categorizedData,
                       name: chartName
                    }
                  : slot;
            });
         } else {
            const newChart = {
               id: state.charts[3]?.id ?? 4,
               data: newSlotData,
               categorizedData: categorizedData,
               name: chartName
            };

            state.charts = [...state.charts.slice(1), newChart];
         }

         localStorage.setItem('charts', JSON.stringify(state.charts));
         localStorage.setItem(
            'userCategories',
            JSON.stringify(state.userCategories)
         );
      });
   }
});

export const addChartThunk = createAsyncThunk<
   IAddChartThunkResponse,
   IAddChartThunkArgs,
   { state: RootState }
>('charts/addChart', async ({ newSlotData, chartName }, { getState }) => {
   return {
      newSlotData,
      chartName,
      categorizedData: categorizeExpenses(newSlotData)
   };
});

export const { removeChart, addExpense } = chartSlice.actions;
export default chartSlice.reducer;
