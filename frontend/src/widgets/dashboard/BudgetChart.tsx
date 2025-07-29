import { useEffect, useState, type FC } from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import ChartExports from '../../shared/context/ChartContext';
import { type IChartItem } from '../../shared/types/charts';

const { useChartContext } = ChartExports;

interface IBudgetChartProps {
   chartId: number;
};

const BudgetChart: FC<IBudgetChartProps> = ({ chartId }) => {
   const [chartData, setChartData] = useState<IChartItem[] | null>(null);

   const { charts } = useChartContext();

   useEffect(() => {      
      setChartData(charts[chartId-1].data);
   }, [chartId, charts]);

   if (chartData === null) {
      return <span>нет данных</span>
   }

   return (
      <div style={{ width: '100%', height: '400px' }}>
         <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
               <Pie data={chartData} cx='50%' cy='50%' outerRadius={80} fill='#8884d8' dataKey='amount' label={({ category, percent }) => `${category}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}> 
                  {chartData.map((entry, index) => (
                     <Cell key={index} />
                  ))}
               </Pie>
            </PieChart>
         </ResponsiveContainer>
      </div>
   )
}

export default BudgetChart;