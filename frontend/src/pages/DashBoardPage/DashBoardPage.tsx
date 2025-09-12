import { useEffect, useMemo, useState, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Layout } from 'antd';
import { getCategoriesFromChart } from '../../shared/lib/getCategoriesFromChart';
import { useChartStore } from '../../shared/store-hooks/useChartStore';
import ChartModeSwitcher from '../../features/chart-mode-switcher/ui/ChartModeSwitcher';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import Notifications from '../../features/notifications/ui/Notifications/Notification';
import BudgetChart from '../../widgets/dashboard/BudgetChart';
import type { ChartMode, IChartSlot } from '../../shared/types/charts';

const { Content } = Layout;

const DashBoardPage: FC = () => {
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

   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className='container'>
               {isInvalidId ? (
                  <span>Неверный id диаграммы</span>
               ) : (
                  <>
                     <ChartModeSwitcher 
                        displayMode={displayMode} setDisplayMode={setDisplayMode}
                        allCategories={allCategories} 
                        categoriesToShow={categoriesToShow} setCategoriesToShow={setCategoriesToShow}
                     />
                     <BudgetChart 
                        chartId={+paramsId} 
                        displayMode={displayMode} 
                        categoriesToShow={categoriesToShow} 
                     />
                  </>
               )}
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default DashBoardPage;