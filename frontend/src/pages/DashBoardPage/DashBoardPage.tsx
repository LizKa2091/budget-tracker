import { useEffect, useState, type FC } from 'react'
import BudgetChart from '../../widgets/dashboard/BudgetChart';
import { useParams } from 'react-router-dom';
import { type ChartMode, type IChartSlot } from '../../shared/types/charts';
import ChartModeSwitcher from '../../features/chart-mode-switcher/ui/ChartModeSwitcher';
import { Flex, Layout } from 'antd';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import ChartExports from '../../shared/context/ChartContext';
import styles from './DashBoardPage.module.scss';
import type { IExpensesByCategories } from '../../shared/types/expenses';

const { Content } = Layout;
const { useChartContext } = ChartExports;

const DashBoardPage: FC = () => {
   const [displayMode, setDisplayMode] = useState<ChartMode>('default');
   const [allCategories, setAllCategories] = useState<string[]>([]);
   const [categoriesToShow, setCategoriesToShow] = useState<string[]>([]);

   const { charts } = useChartContext();
   const paramsId: string | undefined = useParams().id;

   useEffect(() => {
      if (paramsId) {
         const currChart: IChartSlot | undefined = charts.find((chart: IChartSlot) => chart.id === +paramsId);

         if (currChart) {
            const allCategories: string[] = [];
            const currCategorizedData: IExpensesByCategories[] | null | undefined = currChart.categorizedData;

            if (currCategorizedData) {
               for (const item of currCategorizedData) {
                  if (!allCategories.includes(item.category)) allCategories.push(item.category);
               }
            }
            setAllCategories(allCategories);
            setCategoriesToShow(allCategories);
         }
      }
   }, [paramsId, charts]);

   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className={styles.container}>
               {!paramsId || Number(paramsId) > 4 || Number(paramsId) < 1 ? (
                  <span>Неверный id диаграммы</span>
               ) : (
                  <>
                     <ChartModeSwitcher displayMode={displayMode} setDisplayMode={setDisplayMode} allCategories={allCategories} categoriesToShow={categoriesToShow} setCategoriesToShow={setCategoriesToShow}/>
                     <BudgetChart chartId={+paramsId} displayMode={displayMode} categoriesToShow={categoriesToShow} />
                  </>
               )}
            </Flex>
         </Content>
      </Layout>
   )
}

export default DashBoardPage;