import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import ChartModeSwitcher from '../../../features/chart-mode-switcher/ui/ChartModeSwitcher';
import HeaderBar from '../../../widgets/header-bar/HeaderBar';
import Notifications from '../../../features/notifications/ui/Notifications/Notification';
import BudgetChart from '../../../widgets/dashboard/BudgetChart';
import { useDashboard } from '../model/useDashboard';

const { Content } = Layout;

const DashBoardPage: FC = () => {
   const {
      displayMode,
      setDisplayMode,
      allCategories,
      categoriesToShow,
      setCategoriesToShow,
      isInvalidId,
      paramsId
   } = useDashboard();

   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className="container" wrap="wrap">
               {isInvalidId ? (
                  <span>Неверный id диаграммы</span>
               ) : (
                  <>
                     <ChartModeSwitcher
                        displayMode={displayMode}
                        setDisplayMode={setDisplayMode}
                        allCategories={allCategories}
                        categoriesToShow={categoriesToShow}
                        setCategoriesToShow={setCategoriesToShow}
                     />
                     <BudgetChart
                        chartId={+paramsId!}
                        displayMode={displayMode}
                        categoriesToShow={categoriesToShow}
                     />
                  </>
               )}
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   );
};

export default DashBoardPage;
