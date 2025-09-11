import { type FC } from 'react';
import ImportPdf from '../../features/import-pdf/ui/ImportPdf';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import { Flex, Layout } from 'antd';
import Notifications from '../../features/notifications/ui/Notifications/Notification';

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
         <Notifications />
      </Layout>
   )
}

export default ImportPdfPage;