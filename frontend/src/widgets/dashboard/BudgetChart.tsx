import { useEffect, useMemo, useState, type FC } from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import ChartExports from '../../shared/context/ChartContext';
import { type ChartMode, type IChartItem } from '../../shared/types/charts';
import type { IExpensesByCategories } from '../../shared/types/expenses';

const { useChartContext } = ChartExports;

interface IBudgetChartProps {
   chartId: number;
   displayMode: ChartMode;
};

const BudgetChart: FC<IBudgetChartProps> = ({ chartId, displayMode }) => {
   const [chartData, setChartData] = useState<IChartItem[] | IExpensesByCategories[] | null>(null);

   const { charts } = useChartContext();

   useEffect(() => {      
      if (displayMode === 'categories') setChartData(charts[chartId-1].categorizedData || null);

      else setChartData(charts[chartId-1].data || null);
   }, [chartId, charts, displayMode]);

   const pieData = useMemo(() => {
      if (!chartData) return [];

      if (displayMode === 'categories') {
         return (chartData as IExpensesByCategories[]).map(cat => ({
            category: cat.category,
            amount: Array.isArray(cat.items) ? cat.items.reduce((sum, item) => sum + item.amount, 0) : 0
         }));
      }

      return (chartData as IChartItem[]).map(item => ({ category: item.title, amount: item.amount }));
   }, [chartData, displayMode]);

   if (chartData === null) {
      return <span>нет данных</span>
   }

   return (
      <div style={{ width: '100%', height: '400px' }}>
         <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
               <Pie data={pieData} cx='50%' cy='50%' outerRadius={80} fill='#8884d8' dataKey='amount' label={({ category, percent }) => `${category}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}> 
                  {pieData.map((entry, index) => (
                     <Cell key={index} />
                  ))}
                  <Tooltip formatter={(value, name) => [`${value} ₽`, name]} />
               </Pie>
            </PieChart>
         </ResponsiveContainer>
      </div>
   )
}

export default BudgetChart;