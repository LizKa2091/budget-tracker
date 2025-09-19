import { useState, type FC } from 'react';
import { Button, Flex, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import Typewriter from './Typewriter';
import { useAIAdvice } from '../model/useAIAdvice';
import type { IChartItem } from '../../../shared/types/charts';
import type { IExpensesByCategories } from '../../../shared/types/expenses';
import { words } from '../lib/categoryWords';
import styles from './WhatIfCutForm.module.scss';

interface ICutFormData {
   value?: string;
}

interface IWhatIfCutFormProps {
   chartData: IChartItem[] | IExpensesByCategories[];
}

const WhatIfCutForm: FC<IWhatIfCutFormProps> = ({ chartData }) => {
   const [AIResponse, setAIResponse] = useState<string>('');
   const { handleSubmit, control } = useForm<ICutFormData>();

   const { mutateAsync, error } = useAIAdvice();

   const onSubmit = async (formData: ICutFormData): Promise<void> => {
      try {
         const response = await mutateAsync({ promptType: 'cutSpendings', value: formData.value ?? 'в целом', expenses: chartData });

         setAIResponse(response.answer.replaceAll('*', ''));
      }
      catch (error) {
         console.error(error);
      }
   };

   return (
      <Flex vertical align='center' gap='small'>
         <div>Что если сократить траты на <Typewriter words={words}/>?</div>
         <Form onFinish={handleSubmit(onSubmit)}>
            <Flex vertical align='center' gap='middle'>
               <Form.Item label='Введите категорию или название'>
                  <Controller name='value' control={control} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Button htmlType='submit' type='default'>Представить</Button>
               {AIResponse && <p className={styles.response}>{AIResponse}</p>}
               {error && <p>Ошибка: {error.message}</p>}
            </Flex>
         </Form>
      </Flex>
   )
}

export default WhatIfCutForm