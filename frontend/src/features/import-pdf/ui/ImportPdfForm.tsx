import { useEffect, type FC } from 'react';
import { Button, Flex, Form, Input, Spin, Upload } from 'antd';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import type { IFormValues } from '../types';
import NotificationExports from '../../../shared/context/NotificationContext';

interface IImportPdfFormProps {
   handleSubmit: () => void;
   control: Control<IFormValues>;
   errors: FieldErrors<IFormValues>;
   isPending: boolean;
   isSuccess: boolean | null;
   message: string;
}

const ImportPdfForm: FC<IImportPdfFormProps> = ({ handleSubmit, control, errors, isPending, isSuccess, message }) => {
   const { addNotification } = NotificationExports.useNotifications();

   useEffect(() => {
      if (isSuccess) {
         addNotification('', message, 'info');
      }
   }, [isSuccess, addNotification, message]);

   const handleBeforeUpload = (file: File, onChange: (file: File | null) => void) => {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
         console.error('Поддерживается только pdf формат');
         return Upload.LIST_IGNORE;
      }

      onChange(file);
      return false;
   }
   
   return (
      <Flex vertical justify='center' align='center' gap='middle'>
         <h3>Импортируйте .pdf файл с выпиской из банка за месяц</h3>
         <Form action='#' onFinish={handleSubmit}>
            <Form.Item label='Название новой диаграммы' required validateStatus={errors.chartName ? 'error' : ''} help={errors.chartName?.message}>
               <Controller 
                  name='chartName'
                  control={control} 
                  rules={{ required: 'Пожалуйста, укажите название', minLength: { value: 2, message: 'Минимальная длина 2 символа' } }} 
                  render={({ field }) => 
                     <Input {...field} disabled={isPending} /> } 
               />
            </Form.Item>
            <Form.Item label='Файл с выпиской из банка (*.pdf)' required validateStatus={errors.pdfFile ? 'error' : ''} help={errors.pdfFile?.message}>
               <Controller 
                  name='pdfFile' 
                  control={control} 
                  rules={{ required: 'Пожалуйста, прикрепите PDF файл' }} 
                  render={({ field: { onChange, value } }) => (
                     <Upload.Dragger 
                        name='pdfFile'
                        multiple={false} 
                        maxCount={1} 
                        beforeUpload={(file) => handleBeforeUpload(file, onChange)}
                        fileList={value ? [{ uid: "-1", name: value.name, status: "done" }] : []}
                        onRemove={() => onChange(null)}
                        accept='.pdf'
                        disabled={isPending}
                     >
                        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                        <p className="ant-upload-hint">Поддерживается только PDF формат</p>
                     </Upload.Dragger>
                  )
               } />
            </Form.Item>
            <Flex justify='center'>
               <Button htmlType='submit' disabled={isPending}>Отправить</Button>
            </Flex>
         </Form>
         {isPending && <Spin />}
         {!isPending && isSuccess === false && <span className='failed-response'>{message}</span>}
      </Flex>
   )
}

export default ImportPdfForm;