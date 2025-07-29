import { Segmented } from 'antd';
import { type FC } from 'react'
import type { ChartMode } from '../../../shared/types/charts';

interface IChartModeSwitcherProps {
   setDisplayMode: (value: ChartMode) => void; 
}

const ChartModeSwitcher: FC<IChartModeSwitcherProps> = ({ setDisplayMode }) => {
   const handleSegmentedChange = (value: string) => {
      if (value === 'Без категорий') setDisplayMode('default');
      else if (value === 'По категориям') setDisplayMode('categories');
   };

   return (
      <div>
         Показывать все траты
         <Segmented options={['Без категорий', 'По категориям']} onChange={handleSegmentedChange} />
      </div>
   )
}

export default ChartModeSwitcher;