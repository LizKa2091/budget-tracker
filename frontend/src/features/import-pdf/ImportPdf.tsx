import { useState, type FC } from 'react';
import { Button, Form, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';

interface IFormValues {
   pdfFile: File | null;
};

const ImportPdf: FC = () => {
   const { handleSubmit, control } = useForm<IFormValues>();
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const onSubmit = async (data: IFormValues): Promise<void> => {
      if (!data.pdfFile) return;

      setIsLoading(true);
      try {
         const response = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: data.pdfFile
         });

         if (!response.ok) throw new Error('ошибка сервера')
         
         const result = await response.json();
         console.log(result);
      }
      catch (e) {
         console.error(`ошибка загрузки ${e}`);
      }
      finally {
         setIsLoading(false);
      }
   };

   const handleBeforeUpload = (file: File, onChange: (file: File | null) => void) => {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
         console.error('Поддерживается только pdf формат');
         return Upload.LIST_IGNORE;
      }

      onChange(file);
      return isPdf;
   }

   return (
      <div>
         <Form action='#' onFinish={handleSubmit(onSubmit)}>
            <Form.Item label='Файл с выпиской из банка (*.pdf)'>
               <Controller name='pdfFile' control={control} rules={{ required: 'Пожалуйста, прикрепите PDF файл' }} render={({ field: { onChange, value, ...restField } }) => (
                  <Upload.Dragger 
                     {...restField} name='pdfFile'
                     multiple={false} maxCount={1} 
                     beforeUpload={(file) => handleBeforeUpload(file, onChange)}
                     fileList={value ? [value as any] : []}
                     onRemove={() => onChange(null)}
                     accept='.pdf'>
                     <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                     </p>
                     <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                     <p className="ant-upload-hint">Поддерживается только PDF формат</p>
                  </Upload.Dragger>
               )} />
            </Form.Item>
            <Button htmlType='submit'>Отправить</Button>
         </Form>
         {isLoading && <p>Загрузка</p>}
      </div>
   )
}

export default ImportPdf;