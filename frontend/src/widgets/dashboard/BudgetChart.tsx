import { useEffect, useMemo, useState, type FC } from 'react';
import { Button, Flex, Grid } from 'antd';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import BudgetSimulator from '../budget-simulator/ui/BudgetSimulator';
import AddExpenseForm from '../../features/add-expense/ui/AddExpenseForm';
import { useChartStore } from '../../shared/store-hooks/useChartStore';
import { getRandomColor } from '../../shared/lib/getRandomColor';
import { type ChartMode, type IChartItem } from '../../shared/types/charts';
import type { IExpensesByCategories } from '../../shared/types/expenses';
import {
   maxRadiusSize,
   minRadiusSize
} from '../budget-simulator/lib/radiusSizes';
import styles from './BudgetChart.module.scss';

const { useBreakpoint } = Grid;

interface IPieData {
   category: string;
   amount: number;
   color: string;
}

interface IBudgetChartProps {
   chartId: number;
   displayMode: ChartMode;
   categoriesToShow: string[] | null;
}

const BudgetChart: FC<IBudgetChartProps> = ({
   chartId,
   displayMode,
   categoriesToShow
}) => {
   const [itemColors, setItemColors] = useState<string[]>([]);
   const [currRadius, setCurrRadius] = useState<number>(150);
   const [pieData, setPieData] = useState<IPieData[]>([]);

   const screens = useBreakpoint();
   const isMobile = !screens.md;

   const { charts } = useChartStore();

   const chartData: IChartItem[] | IExpensesByCategories[] | null =
      useMemo(() => {
         if (!charts[chartId - 1]) return [];

         if (displayMode === 'categories') {
            const allData = charts[chartId - 1].categorizedData || [];

            if (!categoriesToShow || categoriesToShow.length === 0)
               return allData;

            return allData.filter(
               (item) =>
                  'category' in item && categoriesToShow.includes(item.category)
            );
         }

         return charts[chartId - 1].data || [];
      }, [chartId, charts, displayMode, categoriesToShow]);

   useEffect(() => {
      if (!chartData) return;

      const dataWithColors = chartData.map((item) => {
         const color = getRandomColor();
         if ('category' in item && 'items' in item) {
            const amount = item.items.reduce((sum, it) => sum + it.amount, 0);
            return { category: item.category, amount: Math.abs(amount), color };
         } else {
            return {
               category: (item as IChartItem).title,
               amount: Math.abs((item as IChartItem).amount),
               color
            };
         }
      });

      setPieData(dataWithColors);
      setItemColors(dataWithColors.map((d) => d.color));
   }, [chartData]);

   const handleChangeRadius = (value: string): void => {
      if (value === '+') {
         if (currRadius + 10 > maxRadiusSize) return;

         setCurrRadius((prev: number) => prev + 10);
      } else if (value === '-') {
         if (currRadius - 10 < minRadiusSize) return;

         setCurrRadius((prev: number) => prev - 10);
      }
   };

   if (chartData === null) {
      return <span>нет данных</span>;
   }

   return (
      <Flex align="center" className={styles.container}>
         <ResponsiveContainer width="100%" height={isMobile ? 450 : 600}>
            <PieChart>
               <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={currRadius}
                  fill="#8884d8"
                  dataKey="amount"
                  label={
                     isMobile
                        ? false
                        : ({ category, percent }) =>
                             percent && percent * 100 >= 1
                                ? `${category}: ${(percent * 100).toFixed(0)}%`
                                : ''
                  }
               >
                  {pieData.map((_, index) => (
                     <Cell key={index} fill={itemColors[index]} />
                  ))}
               </Pie>
               <Tooltip
                  formatter={(value: number, name: string, props) => [
                     `${value} ₽`,
                     props.payload?.category || name
                  ]}
                  labelFormatter={(category) => category}
               />
            </PieChart>
         </ResponsiveContainer>
         <Flex
            vertical
            gap="large"
            align="center"
            className={styles.actionsContainer}
         >
            <AddExpenseForm chartId={chartId} />
            <BudgetSimulator chartData={chartData} />
            <Flex vertical align="center" gap="middle">
               <p>Масштаб</p>
               <Flex vertical gap="small">
                  <Button
                     onClick={() => handleChangeRadius('+')}
                     type="default"
                  >
                     + Увеличить
                  </Button>
                  <Button
                     onClick={() => handleChangeRadius('-')}
                     type="default"
                  >
                     - Уменьшить
                  </Button>
               </Flex>
            </Flex>
         </Flex>
      </Flex>
   );
};

export default BudgetChart;
