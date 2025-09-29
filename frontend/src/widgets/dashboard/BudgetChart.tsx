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
   const [chartData, setChartData] = useState<
      IChartItem[] | IExpensesByCategories[] | null
   >(null);
   const [itemColors, setItemColors] = useState<string[]>([]);
   const [currRadius, setCurrRadius] = useState<number>(150);
   const screens = useBreakpoint();
   const isMobile = !screens.md;

   const { charts } = useChartStore();

   useEffect(() => {
      let categorizedItems: IExpensesByCategories[] | IChartItem[] | null;

      if (displayMode === 'categories') {
         categorizedItems =
            categoriesToShow && categoriesToShow.length > 0
               ? charts[chartId - 1].categorizedData?.filter((item) =>
                    categoriesToShow.includes(item.category)
                 ) || null
               : charts[chartId - 1].categorizedData || null;

         const colors: string[] = [];
         categorizedItems?.forEach(() => colors.push(getRandomColor()));
         setItemColors(colors);
      } else {
         categorizedItems = charts[chartId - 1].data || null;
         setItemColors([]);
      }
      setChartData(categorizedItems);
   }, [chartId, charts, displayMode, categoriesToShow]);

   const pieData = useMemo(() => {
      if (!chartData) return [];

      if (displayMode === 'categories') {
         return (chartData as IExpensesByCategories[]).map((cat) => ({
            category: cat.category,
            amount: Array.isArray(cat.items)
               ? cat.items.reduce((sum, item) => sum + item.amount, 0)
               : 0
         }));
      }

      return (chartData as IChartItem[]).map((item) => ({
         category: item.title,
         amount: item.amount
      }));
   }, [chartData, displayMode]);

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
