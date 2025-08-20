import { Layout, Flex } from 'antd';
import { type FC } from 'react'
import ChartSlots from '../../features/chart-slots/ChartSlots';
import HeaderBar from '../../widgets/header-bar/HeaderBar';

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
      </Layout>
   )
}

export default ChartSlotsPage;