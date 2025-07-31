import { Button, Flex, Form, Input } from 'antd';
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form';

interface IGoalFormData {
   goalValue: number;
};

const SetGoalForm: FC = () => {
   const { handleSubmit, control, formState: { errors }, trigger } = useForm<IGoalFormData>();

   const onSubmit = (data: IGoalFormData): void => {
      console.log(data);
   };

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['goalValue']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   return (
      <Flex vertical align='center' gap='small'>
         <p>Цель по сбережению</p>
         <Form onFinish={onFinish}>
            <Flex vertical align='center'>
               <Form.Item label='Введите сумму' required validateStatus={errors.goalValue ? 'error' : ''} help={errors.goalValue && 'Обязательное поле'}>
                  <Controller name='goalValue' control={control} rules={{ required: true }} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Button htmlType='submit' type='default'>Поставить цель</Button>
            </Flex>
         </Form>
      </Flex>
   )
}

export default SetGoalForm;