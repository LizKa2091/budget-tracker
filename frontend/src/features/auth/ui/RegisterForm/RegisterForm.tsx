import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import AuthExports from '../../../../shared/context/AuthContext';
import type { IFormMessage, IRegisterFormData } from '../../authTypes';

const RegisterForm: FC = () => {
   const { handleSubmit, control, formState: { errors }, watch } = useForm<IRegisterFormData>();
   const { register, isRegistering } = AuthExports.useAuthContext();
   const [registerStatus, setRegisterStatus] = useState<IFormMessage>();

   const email = watch('email');
   const password =  watch('password');
   const passwordRepeat = watch('passwordRepeat');
   const name = watch('name');

   useEffect(() => {
      setRegisterStatus({ message: '', type: undefined });
   }, [email, password, passwordRepeat, name]);

   const onSubmit = async (data: IRegisterFormData) => {
      setRegisterStatus({ message: '', type: undefined });

      const response = await register(data.email, data.password, data.name);

      if (response instanceof Error) {
         setRegisterStatus({ message: response.message, type: 'error' });
         return;
      }

      setRegisterStatus({ message: response.message, type: 'success' });
   };

   return (
      <Flex vertical justify='center' align='center' gap='middle'>
         <h3>Регистрация</h3>
         <Form action='#' onFinish={handleSubmit(onSubmit)}>
            <Form.Item label='Почта' required validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
               <Controller name='email' control={control} rules={{ required: 'Введите почту', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Неверный формат почты' } }} render={({ field }) =>
                  <Input autoComplete='email' aria-invalid={!!errors.email} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Пароль' required validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
               <Controller name='password' control={control} rules={{ required: 'Введите пароль', minLength: { value: 6, message: 'Минимальная длина пароля 6 символов' } }} render={({ field }) => 
                  <Input.Password aria-invalid={!!errors.password} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Повторите пароль' required validateStatus={errors.passwordRepeat ? 'error' : ''} help={errors.passwordRepeat?.message}>
               <Controller name='passwordRepeat' control={control} rules={{ required: 'Повторите пароль', validate: (value, formValues) => value === formValues.password || 'Пароли должны совпадать' }} render={({ field }) => 
                  <Input.Password aria-invalid={!!errors.passwordRepeat} {...field} />
               } />
            </Form.Item>
            <Form.Item label='Имя' required validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
               <Controller name='name' control={control} rules={{ required: 'Введите имя' }} render={({ field }) => 
                  <Input aria-invalid={!!errors.name} {...field} />
               } />
            </Form.Item>
            <Flex justify='center'>
               <Button htmlType='submit' loading={isRegistering}>Зарегистрироваться</Button>
            </Flex>
         </Form>
         <Flex>
            {registerStatus?.message &&
               <p className={registerStatus.type === 'error' ? 'failed-response' : 'success-response'}>{registerStatus.message}</p>
            }
         </Flex>
      </Flex>
   )
}

export default RegisterForm