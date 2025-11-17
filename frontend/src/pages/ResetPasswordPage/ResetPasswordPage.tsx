import type { FC } from 'react';
import { Flex } from 'antd';

import MainLayout from '../../app/MainLayout';
import ResetPassForm from '../../features/auth/ui/ResetPassForm/ResetPassForm';

const ResetPasswordPage: FC = () => {
   return (
      <MainLayout>
         <Flex vertical justify='center' align='center' gap='large'>
            <h2>Сброс пароля</h2>
            <ResetPassForm />
         </Flex>
      </MainLayout>
   )
}

export default ResetPasswordPage;