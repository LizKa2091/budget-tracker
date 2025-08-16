import { type FC } from 'react';
import ImportPdf from '../../features/import-pdf/ui/ImportPdf';
import HeaderBar from '../../widgets/header-bar/HeaderBar';
import { Flex, Layout } from 'antd';
import styles from './ImportPdfPage.module.scss';

const { Content } = Layout;

const ImportPdfPage: FC = () => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            <Flex className={styles.container}>
               <ImportPdf />
            </Flex>
         </Content>
      </Layout>
   )
}

export default ImportPdfPage;