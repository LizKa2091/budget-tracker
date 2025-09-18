import { type FC } from 'react';
import { Flex } from 'antd';
import SetGoalForm from './SetGoalForm';
import WhatIfCutForm from './WhatIfCutForm';
import type { IChartItem } from '../../../shared/types/charts';
import type { IExpensesByCategories } from '../../../shared/types/expenses';

interface IBudgetSimulatorProps {
   chartData: IChartItem[] | IExpensesByCategories[]
}

const BudgetSimulator: FC<IBudgetSimulatorProps> = ({ chartData }) => {
   return (
      <Flex vertical align='center' gap='large'>
         <p>Получите совет от нейросети</p>
         <Flex vertical gap='large'>
            <SetGoalForm chartData={chartData} />
            <WhatIfCutForm chartData={chartData} />
         </Flex>
      </Flex>
   )
}

export default BudgetSimulator