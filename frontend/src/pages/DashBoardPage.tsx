import { useState, type FC } from 'react'
import BudgetChart from '../widgets/dashboard/BudgetChart';
import { useParams } from 'react-router-dom';
import { type ChartMode } from '../shared/types/charts';
import ChartModeSwitcher from '../features/chart-mode-switcher/ui/ChartModeSwitcher';
import { Flex, Layout } from 'antd';
import HeaderBar from '../widgets/header-bar/HeaderBar';

const { Content } = Layout;

const DashBoardPage: FC = () => {
   const [displayMode, setDisplayMode] = useState<ChartMode>('default')

   const paramsId: string | undefined = useParams().id;

   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex>
               {!paramsId || Number(paramsId) > 4 || Number(paramsId) < 1 ? (
                  <span>Неверный id диаграммы</span>
               ) : (
                  <>
                     <ChartModeSwitcher setDisplayMode={setDisplayMode} />
                     <BudgetChart chartId={+paramsId} displayMode={displayMode}/>
                  </>
               )}
            </Flex>
         </Content>
      </Layout>
   )
}

export default DashBoardPage;