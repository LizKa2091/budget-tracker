import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import Notifications from '../../features/notifications/ui/Notifications/Notification';
import Dashboard from '../../features/dashboard/ui/Dashboard';

const { Content } = Layout;

const DashBoardPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className="container" wrap="wrap">
               <Dashboard />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default DashBoardPage;