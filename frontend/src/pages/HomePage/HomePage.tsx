import { type FC } from 'react';
import { Flex } from 'antd';

import MainLayout from '../../app/MainLayout';
import Home from '../../features/home/ui/Home';

const HomePage: FC = () => {
   return (
      <MainLayout>
         <Flex className='container' vertical align='center' gap='large'>
            <Home />
         </Flex>
      </MainLayout>
   )
}

export default HomePage;