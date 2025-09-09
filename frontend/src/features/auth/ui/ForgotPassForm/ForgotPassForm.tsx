import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import AuthExports from '../../../../shared/context/AuthContext';
import type { IForgotPassFormData, IFormMessage } from '../../authTypes';

const ForgotPassForm: FC = () => {
   const [forgotStatus, setForgotStatus] = useState<IFormMessage>();
   const { handleSubmit, control, formState: { errors }, watch } = useForm<IForgotPassFormData>();
   const { forgotPassword, isForgetting } = AuthExports.useAuthContext();
   
   const email = watch('email');

   useEffect(() => {
      setForgotStatus({ message: '', type: undefined });
   }, [email]);

   const onSubmit = async (data: IForgotPassFormData): Promise<void> => {
      setForgotStatus({ message: '', type: undefined });

      const response = await forgotPassword(data.email);

      if (response instanceof Error) {
         setForgotStatus({ message: response.message, type: 'error' });
         return;
      }

      if (response.resetToken) {
         localStorage.setItem('resetToken', response.resetToken);
         setForgotStatus({ message: response.message, type: 'success' });
         return;
      }

      setForgotStatus({ message: 'Непредвиденная ошибка', type: 'error' });
   };

   return (
      <Flex vertical justify='center' align='center' gap='middle'>
         <h3>Восстановление пароля</h3>
         <Form onFinish={handleSubmit(onSubmit)} action='#'>
            <Form.Item label='Почта' required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
               <Controller name='email' control={control} rules={{ required: 'Введите почту', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) => 
               <Input autoComplete='email' aria-invalid={!!errors.email} {...field} />
            } />
            </Form.Item>
            <Flex justify='center'>
               <Button htmlType='submit' loading={isForgetting}>Найти аккаунт</Button>
            </Flex>
         </Form>
         <Flex vertical align='center' gap='middle'>
            {forgotStatus?.message &&
               <p className={forgotStatus.type === 'error' ? 'failed-response' : 'success-response'}>{forgotStatus.message}</p>
            }
            {forgotStatus?.type === 'success' &&
               <Link to='/reset-password'>Сменить пароль</Link>
            }
         </Flex>
      </Flex>
   )
}

export default ForgotPassForm;