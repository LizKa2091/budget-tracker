import { Button, Flex, Form, Input } from 'antd';
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ICutFormData {
   value?: string;
};

const WhatIfCutForm: FC = () => {
   const { handleSubmit, control } = useForm<ICutFormData>();

   const onSubmit = (data: ICutFormData): void => {
      console.log(data);
   };

   return (
      <Flex vertical align='center' gap='small'>
         <p>Что если убрать *трату*</p>
         <Form onFinish={handleSubmit(onSubmit)}>
            <Flex vertical align='center'>
               <Form.Item label='Введите категорию или название'>
                  <Controller name='value' control={control} render={({ field }) => <Input {...field} />} />
               </Form.Item>
               <Button htmlType='submit' type='default'>Представить</Button>
            </Flex>
         </Form>
      </Flex>
   )
}

export default WhatIfCutForm;