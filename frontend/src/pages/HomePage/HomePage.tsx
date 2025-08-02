import { Layout, Flex } from 'antd';
import { type FC } from 'react'
import { Link } from 'react-router-dom';
import styles from './HomePage.module.scss';

const { Content } = Layout;

const HomePage: FC = () => {
   return (
      <Layout>
         <Content>
            <Flex vertical className={styles.container} gap='middle'>
               <h2>Добро пожаловать на Budget Tracker</h2>
               <Link to='/dashboard'>Перейти к сохранённым диаграммам</Link>
            </Flex>
         </Content>
      </Layout>
   )
}

export default HomePage;