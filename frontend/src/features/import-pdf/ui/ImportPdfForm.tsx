import { Button, Flex, Form, Input, Spin, Upload } from 'antd';
import type { FC } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import type { IFormValues } from '../types';

interface IImportPdfFormProps {
   handleSubmit: () => void;
   control: Control<IFormValues>;
   errors: FieldErrors<IFormValues>;
   isLoading: boolean;
   isSuccess: boolean | null;
}

const ImportPdfForm: FC<IImportPdfFormProps> = ({ handleSubmit, control, errors, isLoading, isSuccess }) => {
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
      <Flex vertical gap='middle'>
         <h3>Импортируйте .pdf файл с выпиской из банка за месяц</h3>
         <Form action='#' onFinish={handleSubmit}>
            <Form.Item label='Название новой диаграммы' required validateStatus={errors.chartName ? 'error' : ''} help={errors.chartName?.message}>
               <Controller 
                  name='chartName'
                  control={control} 
                  rules={{ required: 'Пожалуйста, укажите название', minLength: { value: 2, message: 'Минимальная длина 2 символа' } }} 
                  render={({ field }) => 
                     <Input {...field} disabled={isLoading} /> } 
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
                        disabled={isLoading}
                     >
                        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                        <p className="ant-upload-hint">Поддерживается только PDF формат</p>
                     </Upload.Dragger>
                  )
               } />
            </Form.Item>
            <Flex justify='center'>
               <Button htmlType='submit' disabled={isLoading}>Отправить</Button>
            </Flex>
         </Form>
         {isLoading && <Spin />}
         {isSuccess && <span className='success-response'>Файл успешно загружен</span>}
         {isSuccess === false && <span className='failed-response'>Произошла ошибка при загрузке файла</span>}
      </Flex>
   )
}

export default ImportPdfForm;