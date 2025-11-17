import { type FC, type ReactNode } from 'react';
import { Layout } from 'antd';

import HeaderBar from '../widgets/header-bar/HeaderBar';
import Notifications from '../features/notifications/ui/Notifications/Notification';

const { Content } = Layout;

interface IMainLayoutProps {
   children: ReactNode;
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
   return (
      <Layout>
         <HeaderBar />
         <Content>
            {children}
         </Content>
         <Notifications />
      </Layout>
   )
}

export default MainLayout;