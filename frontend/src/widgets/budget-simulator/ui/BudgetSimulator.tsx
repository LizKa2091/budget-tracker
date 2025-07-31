import { type FC } from 'react';
import { Flex } from 'antd';
import SetGoalForm from './SetGoalForm';
import WhatIfCutForm from './WhatIfCutForm';

const BudgetSimulator: FC = () => {
   return (
      <Flex vertical align='center' gap='large'>
         <p>Получите совет от нейросети</p>
         <Flex vertical gap='large'>
            <SetGoalForm />
            <WhatIfCutForm />
         </Flex>
      </Flex>
   )
}

export default BudgetSimulator;