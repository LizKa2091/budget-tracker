import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import AuthExports from '../../../../shared/context/AuthContext';
import type { IFormMessage, IResetPassFormData } from '../../authTypes';

const ResetPassForm: FC = () => {
   const [resetStatus, setResetStatus] = useState<IFormMessage>();
   const { handleSubmit, control, formState: { errors }, watch } = useForm<IResetPassFormData>();
   const { resetPassword, isResetting } = AuthExports.useAuthContext();
   
   const newPassword = watch('newPassword');
   const newPasswordRepeat = watch('newPasswordRepeat');
   const resetToken = localStorage.getItem('resetToken');

   useEffect(() => {
      setResetStatus({ message: '', type: undefined });
   }, [newPassword, newPasswordRepeat]);

   const onSubmit = async (data: IResetPassFormData): Promise<void> => {
      if (!resetToken) {
         setResetStatus({ message: 'Не найден reset token, запросите восстановление аккаунта заново', type: 'error' });
         return;
      }

      setResetStatus({ message: '', type: undefined });
      
      const response = await resetPassword(resetToken, data.newPassword);

      if (response instanceof Error) {
         setResetStatus({ message: response.message, type: 'error' });
         return;
      }

      setResetStatus({ message: response.message, type: 'success' });
   };

   return (
      <Flex vertical justify='center' align='center' gap='middle'>
         <h3>Смена пароля</h3>
         <Form onFinish={handleSubmit(onSubmit)} action='#'>
            <Form.Item label='Новый пароль' required validateStatus={errors.newPassword ? 'error' : ''} help={errors.newPassword?.message}>
               <Controller name='newPassword' control={control} rules={{ required: 'Введите новый пароль', minLength: { value: 6, message: 'Минимальная длина пароля 6 символов' } }} render={({ field }) => 
                  <Input.Password aria-invalid={!!errors.newPassword} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Повтор нового пароля' required validateStatus={errors.newPasswordRepeat ? 'error' : ''} help={errors.newPasswordRepeat?.message}>
               <Controller name='newPasswordRepeat' control={control} rules={{ required: 'Введите повторно новый пароль',  validate: (value, formValues) => value === formValues.newPassword || 'Пароли должны совпадать' }} render={({ field }) => 
                  <Input.Password aria-invalid={!!errors.newPasswordRepeat} {...field} />
               } />
            </Form.Item>
            <Flex justify='center'>
               <Button htmlType='submit' loading={isResetting}>Сменить пароль</Button>
            </Flex>
         </Form>
         <Flex vertical align='center' gap='middle'>
            {resetStatus?.message &&
               <p className={resetStatus.type === 'error' ? 'failed-response' : 'success-response'}>{resetStatus.message}</p>
            }
            {resetStatus?.type && 
               <Link to='/auth'>{resetStatus?.type === 'success' ? 'Войти в аккаунт' : 'Вернуться назад'}</Link>
            }
         </Flex>
      </Flex>
   )
}

export default ResetPassForm;