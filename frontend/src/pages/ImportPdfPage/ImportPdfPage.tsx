import { type FC } from 'react';
import { Flex } from 'antd';

import ImportPdf from '../../features/import-pdf/ui/ImportPdf';
import MainLayout from '../../app/MainLayout';

const ImportPdfPage: FC = () => {
   return (
      <MainLayout>
         <Flex className='container'>
            <ImportPdf />
         </Flex>
      </MainLayout>
   )
}

export default ImportPdfPage;