import { useEffect, useState, type FC } from 'react'
import { Link } from 'react-router-dom';
import type { IChartSlot } from '../../shared/types/charts';
import ChartExports from '../../shared/context/ChartContext';
import { Button, Card, Flex } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { useChartContext } = ChartExports;

const ChartSlots: FC = () => {
   const [savedCharts, setSavedCharts] = useState<IChartSlot[]>([]);

   const { charts, deleteChart } = useChartContext();

   useEffect(() => {
      const notEmptyCharts: IChartSlot[] = charts.filter(chart => chart.data);

      setSavedCharts(notEmptyCharts);
   }, [charts]);

   const handleDelChart = (chartId: number): void => {
      deleteChart(chartId);
   };

   if (savedCharts.length === 0) {
      return (
         <>
            <h2>У вас пока нет сохранённых диаграмм</h2>
            <Link to='/import-pdf'>Импортировать выписку за месяц в pdf формате</Link>
         </>
      );
   }

   return (
      <Flex vertical gap='middle'>
         <h2>Ваши сохранённые слоты</h2>
         <Flex gap='large'>
            {savedCharts.map((chart: IChartSlot) =>
               <Card 
                  key={chart.id} 
                  title={chart.name} 
                  extra={<Button danger icon={<DeleteOutlined />} onClick={() => handleDelChart(chart.id)} aria-label='Удалить' title='Удалить' />}
               >
                  <Flex vertical>
                     {chart.data && `Дата первой траты: ${chart.data[0].date}`}
                     <Link to={`/dashboard/${chart.id}`}>Перейти к диаграмме</Link>
                  </Flex>
               </Card>
            )}
         </Flex>
      </Flex>
   )
}

export default ChartSlots;