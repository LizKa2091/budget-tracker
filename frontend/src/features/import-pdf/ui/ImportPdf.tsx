import { useEffect, useState, type FC } from 'react';
import { Button, Flex, Form, Input, Spin, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import { useImportPdf } from '../model/useImportPdf';
import ChartExports from '../../../shared/context/ChartContext';
import type { IExpenseItem } from '../../../shared/types/expenses';
import type { IChartItem } from '../../../shared/types/charts';
import { defineCategory } from '../../../shared/lib/defineCategory';

const { useChartContext } = ChartExports;

interface IFormValues {
   chartName: string;
   pdfFile: File | null;
};

const ImportPdf: FC = () => {
   const { handleSubmit, control } = useForm<IFormValues>();
   const { mutate: importPdf } = useImportPdf();
   const { addChart } = useChartContext();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

   useEffect(() => {
      if (isLoading) {
         setIsSuccess(null);
      }
   }, [isLoading]);

   const onSubmit = async (data: IFormValues): Promise<void> => {
      if (!data.pdfFile || !data.chartName) return;

      setIsLoading(true);

      importPdf(data.pdfFile, {
         onSuccess: (expenseItems: IExpenseItem[]) => {
            setIsSuccess(true);
            const expenseItemsWithCategories: IChartItem[] = [];

            for (const item of expenseItems) {
               expenseItemsWithCategories.push({ ...item, category: defineCategory(item.title) });
            }
            addChart(expenseItemsWithCategories, data.chartName);
         },
         onError: () => setIsSuccess(false),
         onSettled: () => setIsLoading(false)
      });
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
      <Flex vertical>
         <h2>Создание новой диаграммы</h2>
         <h3>Импортируйте .pdf файл с выпиской из банка за месяц</h3>
         <Form action='#' onFinish={handleSubmit(onSubmit)}>
            <Form.Item label='Название новой диаграммы'>
               <Controller name='chartName' control={control} rules={{ required: 'Пожалуйста, введите название новой диаграммы' }} render={({ field }) => <Input {...field} disabled={isLoading} /> } />
            </Form.Item>
            <Form.Item label='Файл с выпиской из банка (*.pdf)'>
               <Controller name='pdfFile' control={control} rules={{ required: 'Пожалуйста, прикрепите PDF файл' }} render={({ field: { onChange, value, ...restField } }) => (
                  <Upload.Dragger 
                     {...restField} name='pdfFile'
                     multiple={false} maxCount={1} 
                     beforeUpload={(file) => handleBeforeUpload(file, onChange)}
                     fileList={value ? [value as any] : []}
                     onRemove={() => onChange(null)}
                     accept='.pdf'
                     disabled={isLoading}
                  >
                     <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                     </p>
                     <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                     <p className="ant-upload-hint">Поддерживается только PDF формат</p>
                  </Upload.Dragger>
               )} />
            </Form.Item>
            <Button htmlType='submit' disabled={isLoading}>Отправить</Button>
         </Form>
         {isLoading && <Spin />}
         {isSuccess && <span>Файл успешно загружен</span>}
         {isSuccess === false && <span>Произошла ошибка при загрузке файла</span>}
      </Flex>
   )
}

export default ImportPdf;