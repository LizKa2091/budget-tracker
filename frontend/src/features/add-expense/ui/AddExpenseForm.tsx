import { type FC } from 'react';
import { Button, DatePicker, Flex, Form, Input, InputNumber } from 'antd';
import { Dayjs } from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { useChartStore } from '../../../shared/store-hooks/useChartStore';

interface IFormData {
   chartId: number;
   category: string;
   date: Dayjs;
   title: string;
   amount: number;
};

interface IAddExpenseFormProps {
   chartId: number;
}

const AddExpenseForm: FC<IAddExpenseFormProps> = ({ chartId }) => {
   const { handleSubmit, control, formState: { errors }, trigger } = useForm<IFormData>();
   const { addExpense } = useChartStore();

   const onSubmit = (formData: IFormData) => {
      addExpense({ 
         chartId, 
         category: formData.category, 
         date: formData.date ? formData.date.toISOString() : new Date().toISOString(), 
         title: formData.title, 
         amount: formData.amount
      });
   };

   const onFinish = async (): Promise<void> => {
      const isValid = await trigger(['category', 'date', 'title', 'amount']);

      if (isValid) handleSubmit(onSubmit)();
   };

   return (
      <Flex vertical gap='large' align='center'>
         <h3>Добавить новую трату</h3>
         <Form onFinish={onFinish}>
            <Flex vertical align='center'>
               <Form.Item label='Название' required validateStatus={errors.title ? 'error' : ''} help={errors.title && 'Обязательное поле'}>
                  <Controller name='title' control={control} rules={{ required: true }} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Form.Item label='Дата' required validateStatus={errors.date ? 'error' : ''} help={errors.date && 'Обязательное поле'}>
                  <Controller name='date' control={control} rules={{ required: true }} render={({ field }) => <DatePicker {...field} />} />
               </Form.Item>
               <Form.Item label='Сумма в рублях' required validateStatus={errors.amount ? 'error' : ''} help={errors.amount && 'Обязательное поле'}>
                  <Controller name='amount' control={control} rules={{ required: true, validate: (val: number) => val >= 1 || 'Сумма должна быть больше или равна 1' }} render={({ field }) => <InputNumber {...field} min={1} />} />
               </Form.Item>
               <Form.Item label='Категория' required validateStatus={errors.category ? 'error' : ''} help={errors.category && 'Обязательное поле'}>
                  <Controller name='category' control={control} rules={{ required: true }} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Button htmlType='submit'>Добавить</Button>
            </Flex>
         </Form>
      </Flex>
   )
}

export default AddExpenseForm;