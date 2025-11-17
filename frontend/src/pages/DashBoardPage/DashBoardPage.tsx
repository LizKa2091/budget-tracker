import { type FC } from 'react';
import { Flex } from 'antd';

import MainLayout from '../../app/MainLayout';
import Dashboard from '../../features/dashboard/ui/Dashboard';

const DashBoardPage: FC = () => {
   return (
      <MainLayout>
         <Flex className="container" wrap="wrap">
            <Dashboard />
         </Flex>
      </MainLayout>
   )
}

export default DashBoardPage;