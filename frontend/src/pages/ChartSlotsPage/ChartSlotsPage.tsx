import type { FC } from 'react'
import { Layout, Flex } from 'antd';
import ChartSlots from '../../features/chart-slots/ChartSlots';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import Notifications from '../../features/notifications/ui/Notifications/Notification';

const { Content } = Layout;

const ChartSlotsPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className='container'>
               <ChartSlots />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default ChartSlotsPage