import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'antd';

import MainLayout from '../../app/MainLayout';

const NotFoundPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical align='center' gap='large' className='centered'>
            <h2>Страница не найдена</h2>
            <Link to='/'>Вернуться на главную страницу</Link>
         </Flex>
      </MainLayout>
   )
}

export default NotFoundPage;