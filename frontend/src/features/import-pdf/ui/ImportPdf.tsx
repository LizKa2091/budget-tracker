import type { FC } from 'react';
import { Flex } from 'antd';
import ImportPdfForm from './ImportPdfForm';
import { useImportPdfForm } from '../model/useImportPdfForm';

const ImportPdf: FC = () => {
   return (
      <Flex vertical gap='small'>
         <h2>Создание новой диаграммы</h2>
         <ImportPdfForm {...useImportPdfForm()} />
      </Flex>
   )
}

export default ImportPdf