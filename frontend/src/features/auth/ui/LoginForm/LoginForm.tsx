import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import type { IFormMessage, ILoginFormData } from '../../authTypes';
import AuthExports from '../../../../shared/context/AuthContext';

const LoginForm: FC = () => {
   const {
      handleSubmit,
      control,
      formState: { errors },
      watch
   } = useForm<ILoginFormData>();
   const [loginStatus, setLoginStatus] = useState<IFormMessage>();
   const { login, isLogining } = AuthExports.useAuthContext();

   const email = watch('email');
   const password = watch('password');

   useEffect(() => {
      setLoginStatus({ message: '', type: undefined });
   }, [email, password]);

   const onSubmit = async (data: ILoginFormData) => {
      setLoginStatus({ message: '', type: undefined });

      const response = await login(data.email, data.password);

      if (response instanceof Error) {
         setLoginStatus({ message: response.message, type: 'error' });
         return;
      }

      setLoginStatus({ message: response.message, type: 'success' });
   };

   return (
      <Flex vertical justify="center" align="center" gap="middle">
         <h3>Вход</h3>
         <Form onFinish={handleSubmit(onSubmit)} action="#">
            <Form.Item
               label="Почта"
               required
               validateStatus={errors.email ? 'error' : ''}
               help={errors.email?.message}
            >
               <Controller
                  name="email"
                  control={control}
                  rules={{
                     required: 'Введите почту',
                     pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Неверный формат почты'
                     }
                  }}
                  render={({ field }) => (
                     <Input
                        id="email"
                        autoComplete="email"
                        aria-label="Почта"
                        aria-invalid={!!errors.email}
                        {...field}
                     />
                  )}
               />
            </Form.Item>
            <Form.Item
               label="Пароль"
               required
               validateStatus={errors.password ? 'error' : ''}
               help={errors.password?.message}
            >
               <Controller
                  name="password"
                  control={control}
                  rules={{
                     minLength: {
                        value: 6,
                        message: 'Минимальная длина пароля 6 символов'
                     }
                  }}
                  render={({ field }) => (
                     <Input.Password
                        id="password"
                        aria-label="Пароль"
                        aria-invalid={!!errors.password}
                        {...field}
                     />
                  )}
               />
            </Form.Item>
            <Flex justify="center">
               <Button htmlType="submit" loading={isLogining}>
                  Войти
               </Button>
            </Flex>
         </Form>
         <Flex>
            {loginStatus?.message && (
               <p
                  className={
                     loginStatus.type === 'error'
                        ? 'failed-response'
                        : 'success-response'
                  }
               >
                  {loginStatus.message}
               </p>
            )}
         </Flex>
      </Flex>
   );
};

export default LoginForm;
