import { type FC } from 'react';
import ImportPdf from '../../features/import-pdf/ui/ImportPdf';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import { Flex, Layout } from 'antd';

const { Content } = Layout;

const ImportPdfPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className='container'>
               <ImportPdf />
            </Flex>
         </Content>
      </Layout>
   )
}

export default ImportPdfPage;