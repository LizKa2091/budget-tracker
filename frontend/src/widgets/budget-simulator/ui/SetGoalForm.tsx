import { Button, Flex, Form, InputNumber } from 'antd';
import { useState, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAIAdvice } from '../model/useAIAdvice';
import type { IChartItem } from '../../../shared/types/charts';
import type { IExpensesByCategories } from '../../../shared/types/expenses';
import styles from './SetGoalForm.module.scss';

interface IGoalFormData {
   goalValue: string;
}

interface ISetGoalFormProps {
   chartData: IChartItem[] | IExpensesByCategories[];
}

const SetGoalForm: FC<ISetGoalFormProps> = ({ chartData }) => {
   const [AIResponse, setAIResponse] = useState<string>('');
   const {
      handleSubmit,
      control,
      formState: { errors },
      trigger
   } = useForm<IGoalFormData>();

   const { mutateAsync, error, isPending } = useAIAdvice();

   const onSubmit = async (formData: IGoalFormData): Promise<void> => {
      try {
         const response = await mutateAsync({
            promptType: 'setGoal',
            value: formData.goalValue,
            expenses: chartData
         });

         setAIResponse(response.answer.replaceAll('*', ''));
      } catch (error) {
         console.error(error);
      }
   };

   const onFinish = async (): Promise<void> => {
      const isValidData = await trigger(['goalValue']);

      if (isValidData) handleSubmit(onSubmit)();
   };

   return (
      <Flex vertical align="center" gap="small">
         <p>Цель по сбережению</p>
         <Form onFinish={onFinish}>
            <Flex vertical align="center">
               <Form.Item
                  label="Введите сумму"
                  required
                  validateStatus={errors.goalValue ? 'error' : ''}
                  help={errors.goalValue?.message}
               >
                  <Controller
                     name="goalValue"
                     control={control}
                     rules={{
                        required: 'Введите сумму',
                        minLength: {
                           value: 2,
                           message: 'Минимальная длина: 2 символа'
                        }
                     }}
                     render={({ field }) => (
                        <InputNumber {...field} className={styles.inputGoal} />
                     )}
                  />
               </Form.Item>
               <Button htmlType="submit" type="default" loading={isPending}>
                  Поставить цель
               </Button>
               {AIResponse && <p className={styles.response}>{AIResponse}</p>}
               {error && (
                  <p className={styles.response}>Ошибка: {error.message}</p>
               )}
            </Flex>
         </Form>
      </Flex>
   );
};

export default SetGoalForm;
