import { type FC } from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';

const pieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const BudgetChart: FC = () => {
   return (
      <div style={{ width: '100%', height: '300px' }}>
         <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
               <Pie data={pieData} cx='50%' cy='50%' outerRadius={80} fill='#8884d8' dataKey='value' label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}> 
                  {pieData.map((entry, index) => (
                     <Cell key={`cell-${entry.name}`} />
                  ))}
               </Pie>
            </PieChart>
         </ResponsiveContainer>
      </div>
   )
}

export default BudgetChart;