import type { FC } from 'react';
import { Flex } from 'antd';

import AuthSwitcher from '../../features/auth/ui/AuthSwitcher/AuthSwitcher';
import MainLayout from '../../app/MainLayout';

const AuthPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical justify='center' align='center' gap='large'>
            <h2>Авторизация</h2>
            <AuthSwitcher />
         </Flex>
      </MainLayout>
   )
}

export default AuthPage;