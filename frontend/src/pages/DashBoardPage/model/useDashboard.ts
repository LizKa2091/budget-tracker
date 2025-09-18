import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoriesFromChart } from './../../../shared/lib/getCategoriesFromChart';
import { useChartStore } from "../../../shared/store-hooks/useChartStore";
import type { ChartMode, IChartSlot } from "../../../shared/types/charts";

export const useDashboard = () => {
   const [displayMode, setDisplayMode] = useState<ChartMode>('default');
   const [allCategories, setAllCategories] = useState<string[]>([]);
   const [categoriesToShow, setCategoriesToShow] = useState<string[]>([]);

   const { charts } = useChartStore();
   const paramsId: string | undefined = useParams().id;

   const currChart: IChartSlot | undefined = useMemo(() => {
      if (!paramsId) return undefined;

      return charts.find((chart: IChartSlot) => chart.id === +paramsId);
   }, [paramsId, charts]);

   useEffect(() => {
      if (currChart) {
         const categories = getCategoriesFromChart(currChart);
         
         setAllCategories(categories);
         setCategoriesToShow(categories);
      }
   }, [currChart]);

   const isInvalidId = !paramsId || Number(paramsId) > 4 || Number(paramsId) < 1;

   return { displayMode, setDisplayMode, allCategories, categoriesToShow, setCategoriesToShow, isInvalidId, paramsId }
}