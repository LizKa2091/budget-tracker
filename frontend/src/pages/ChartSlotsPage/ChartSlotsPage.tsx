import { Layout, Flex } from 'antd';
import { type FC } from 'react'
import styles from './ChartSlotsPage.module.scss';
import ChartSlots from '../../features/chart-slots/ChartSlots';

const { Content } = Layout;

const ChartSlotsPage: FC = () => {
   return (
      <Layout>
         <Content>
            <Flex className={styles.container}>
               <ChartSlots />
            </Flex>
         </Content>
      </Layout>
   )
}

export default ChartSlotsPage;