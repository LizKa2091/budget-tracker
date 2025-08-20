import { type FC } from 'react';
import { Flex, Layout } from 'antd';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import { Link } from 'react-router-dom';

const { Content } = Layout;

const NotFoundPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex vertical align='center' gap='large' className='centered'>
               <h2>Страница не найдена</h2>
               <Link to='/'>Вернуться на главную страницу</Link>
            </Flex>
         </Content>
      </Layout>
   )
}

export default NotFoundPage;