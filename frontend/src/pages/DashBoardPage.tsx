import { useState, type FC } from 'react'
import BudgetChart from '../widgets/dashboard/BudgetChart';
import { useParams } from 'react-router-dom';
import { type ChartMode } from '../shared/types/charts';
import ChartModeSwitcher from '../features/chart-mode-switcher/ui/ChartModeSwitcher';

const DashBoardPage: FC = () => {
   const [displayMode, setDisplayMode] = useState<ChartMode>('default')

   const paramsId: string | undefined = useParams().id;

   if (!paramsId || Number(paramsId) > 4 || Number(paramsId) < 1) {
      return (<span>Неверный id диаграммы</span>);
   }
   return (
      <>
         <ChartModeSwitcher setDisplayMode={setDisplayMode} />
         <BudgetChart chartId={+paramsId} displayMode={displayMode}/>
      </>
   )
}

export default DashBoardPage;