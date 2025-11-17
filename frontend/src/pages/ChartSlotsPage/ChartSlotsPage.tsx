import { type FC } from 'react';
import { Flex } from 'antd';

import ChartSlots from '../../features/chart-slots/ui/ChartSlots';
import MainLayout from '../../app/MainLayout';

const ChartSlotsPage: FC = () => {
   return (
      <MainLayout>
         <Flex className="container">
            <ChartSlots />
         </Flex>
      </MainLayout>
   )
}

export default ChartSlotsPage;