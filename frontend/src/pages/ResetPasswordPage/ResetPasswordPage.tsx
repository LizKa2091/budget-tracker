import type { FC } from 'react';
import { Flex, Layout } from 'antd';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import ResetPassForm from '../../features/auth/ui/ResetPassForm/ResetPassForm';
import Notifications from '../../features/notifications/ui/Notifications/Notification';

const { Content } = Layout;

const ResetPasswordPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex vertical justify='center' align='center' gap='large'>
               <h2>Сброс пароля</h2>
               <ResetPassForm />
            </Flex>
         </Content>
         <Notifications />
      </Layout>
   )
}

export default ResetPasswordPage;