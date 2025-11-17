import { type FC } from 'react';
import { Layout, Flex } from 'antd';

import HeaderBar from '../../widgets/header-bar/HeaderBar';
import Notifications from '../../features/notifications/ui/Notifications/Notification';

import Home from '../../features/home/ui/Home';

const { Content } = Layout;

const HomePage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content className='container'>
            <Flex vertical align='center' gap='large'>
               <Home />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default HomePage;