import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { IChartSlot } from "../types/expenses";

interface IChartContext {
   charts: IChartSlot[];
   addChart: (slot: IChartSlot) => void;
   deleteChart: (slot: IChartSlot) => void;
}

interface IChartContextProvider {
   children: ReactNode;
}

const ChartContext = createContext<IChartContext | undefined>(undefined);

const ChartContextProvider: FC<IChartContextProvider> = ({ children }) => {
   const [charts, setCharts] = useState<IChartSlot[]>([]);

   useEffect(() => {
      const savedCharts = localStorage.getItem('charts');

      if (savedCharts) {
         setCharts(JSON.parse(savedCharts));
      }
   }, []);

   useEffect(() => {
      localStorage.setItem('charts', JSON.stringify(charts));
   }, [charts]);

   const addChart = (newSlot: IChartSlot) => {
      setCharts((prev) => [...prev, newSlot].slice(-4));
   };

   const deleteChart = (slot: IChartSlot) => {
      setCharts((prev) => prev.filter((prevSlot) => prevSlot.id !== slot.id));
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