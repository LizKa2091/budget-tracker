import type { FC } from 'react';
import { Flex, Layout } from 'antd';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import AuthSwitcher from '../../features/auth/ui/AuthSwitcher/AuthSwitcher';

const { Content } = Layout;

const AuthPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex vertical justify='center' align='center' gap='large'>
               <h2>Авторизация</h2>
               <AuthSwitcher />
            </Flex>
         </Content>
      </Layout>
   )
}

export default AuthPage;