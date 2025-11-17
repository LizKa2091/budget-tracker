import { type FC } from 'react';
import { useDashboard } from '../model/useDashboard';
import ChartModeSwitcher from '../../../features/chart-mode-switcher/ui/ChartModeSwitcher';
import BudgetChart from '../../../widgets/dashboard/BudgetChart';

const Dashboard: FC = () => {
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
      <>
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
      </>
   )
}

export default Dashboard



