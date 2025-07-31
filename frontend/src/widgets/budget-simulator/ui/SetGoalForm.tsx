import { Button, Flex, Form, InputNumber } from 'antd';
import { useState, type FC } from 'react'
import { Controller, useForm } from 'react-hook-form';
import type { IChartItem } from '../../../shared/types/charts';
import type { IExpensesByCategories } from '../../../shared/types/expenses';
import { useAIAdvice } from '../model/useAIAdvice';

interface IGoalFormData {
   goalValue: string;
};

interface ISetGoalFormProps {
   chartData: IChartItem[] | IExpensesByCategories[]
};

const SetGoalForm: FC<ISetGoalFormProps> = ({ chartData }) => {
   const [AIResponse, setAIResponse] = useState<string>('');
   const { handleSubmit, control, formState: { errors }, trigger } = useForm<IGoalFormData>();

   const { mutateAsync, error } = useAIAdvice();

   const onSubmit = async (formData: IGoalFormData): Promise<void> => {
      try {
         const response = await mutateAsync({ promptType: 'setGoal', value: formData.goalValue, expenses: chartData });

         setAIResponse(response.answer.replaceAll('*', ''));
      }
      catch (error) {
         console.error(error);
      }
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
                  <Controller name='goalValue' control={control} rules={{ required: true }} render={({ field }) => <InputNumber {...field} />} />
               </Form.Item>
               <Button htmlType='submit' type='default'>Поставить цель</Button>
               {AIResponse && <p>{AIResponse}</p>}
               {error && <p>Ошибка: {error.message}</p>}
            </Flex>
         </Form>
      </Flex>
   )
}

export default SetGoalForm;