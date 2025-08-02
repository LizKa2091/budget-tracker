import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { IChartSlot, IChartItem } from "../types/charts";
import { categorizeExpenses } from "../lib/categorizeExpenses";
import type { IExpensesByCategories } from "../types/expenses";

interface IChartContext {
   charts: IChartSlot[];
   addChart: (slot: IChartItem[], name: string) => void;
   deleteChart: (slotId: number) => void;
};

interface IChartContextProvider {
   children: ReactNode;
};

const ChartContext = createContext<IChartContext | undefined>(undefined);

const ChartContextProvider: FC<IChartContextProvider> = ({ children }) => {
   const [isInitialized, setIsInitialized] = useState<boolean>(false);
   const [charts, setCharts] = useState<IChartSlot[]>([
      { id: 1, name: null, data: null },
      { id: 2, name: null, data: null },
      { id: 3, name: null, data: null },
      { id: 4, name: null, data: null }
   ]);

   useEffect(() => {
      const savedCharts = localStorage.getItem('charts');

      if (savedCharts) {
         setCharts(JSON.parse(savedCharts));
      }

      setIsInitialized(true);
   }, []);

   useEffect(() => {
      if (isInitialized) {
         localStorage.setItem('charts', JSON.stringify(charts));
      }
   }, [charts, isInitialized]);

   const addChart = (newSlotData: IChartItem[], chartName: string): void => {
      const categorizedSlotData: IExpensesByCategories[] | null = categorizeExpenses(newSlotData);

      setCharts((prev) => {
         const emptyDataIndex = prev.findIndex(slot => slot.data === null);

         if (emptyDataIndex !== -1) {
            const updatedCharts: IChartSlot[] = [...prev];
            updatedCharts[emptyDataIndex] = { ...updatedCharts[emptyDataIndex], data: newSlotData, categorizedData: categorizedSlotData, name: chartName };

            return updatedCharts;
         }
         
         const shiftedCharts = [...prev.slice(1), { ...prev[3], data: newSlotData, categorizedData: categorizedSlotData, name: chartName }];
         return shiftedCharts;
      })
   };

   const deleteChart = (slotId: number): void => {
      if (slotId > 4 || slotId < 0) return;

      setCharts((prev) => prev.map(currSlot => currSlot.id === slotId ? {...currSlot, data: null, categorizedData: null, name: null} : currSlot));
   };

   return (
      <ChartContext.Provider value={{ charts, addChart, deleteChart }}>
         {children}
      </ChartContext.Provider>
   )
};

const useChartContext = () => {
   const context = useContext(ChartContext);

   if (!context) throw new Error('chart context должен использоваться внутри chart provider');

   return context;
};

const ChartExports = { ChartContext, ChartContextProvider, useChartContext }

export default ChartExports;