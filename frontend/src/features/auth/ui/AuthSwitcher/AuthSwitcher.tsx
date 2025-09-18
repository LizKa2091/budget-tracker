import { useState, type FC } from 'react';
import { Button, Flex } from 'antd';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import ForgotPassForm from '../ForgotPassForm/ForgotPassForm';
import type { AuthMode } from '../../authTypes';
import styles from './AuthSwitcher.module.scss';

const AuthSwitcher: FC = () => {
   const [authMode, setAuthMode] = useState<AuthMode>('login');

   const authForm = () => {
      switch (authMode) {
         case 'login':
            return <LoginForm />;
         case 'register':
            return <RegisterForm />;
         case 'forgot':
            return <ForgotPassForm />;
         default:
            return null;
      }
   }

   return (
      <Flex vertical gap='large' className='outlined-container'>
         {authForm()}

         {authMode === 'login' &&
            <Flex gap='middle'>
               <Button onClick={() => setAuthMode('register')} className={styles.linkButton}>Нет аккаунта? Зарегистрироваться</Button>
               <Button onClick={() => setAuthMode('forgot')} className={styles.linkButton}>Восстановить пароль</Button>
            </Flex>
         }
         {authMode === 'register' &&
            <Button onClick={() => setAuthMode('login')} className={styles.linkButton}>Уже есть аккаунт? Войти</Button>
         }
         {authMode === 'forgot' &&
            <Button onClick={() => setAuthMode('login')} className={styles.linkButton}>Вернуться ко входу в аккаунт</Button>
         }
      </Flex>
   )
}

export default AuthSwitcher
