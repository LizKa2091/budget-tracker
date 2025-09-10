import { useMemo, type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Flex, Layout, Menu } from 'antd';
import ThemeSwitcher from '../../features/theme-switcher/ui/ThemeSwitcher';
import AuthExports from '../../shared/context/AuthContext';
import styles from './HeaderBar.module.scss';

const { Header } = Layout;

const HeaderBar: FC = () => {
   const { token, logout } = AuthExports.useAuthContext();
   const navigate = useNavigate();

   const handleLogoutButton = () => {
      if (token) {
         logout();
         navigate('/');
      }
   };

   const menuItems = useMemo(() => {
      const initialItems = [
         { key: 'main', label: <Link to='/'>Главная</Link>, path: '/' },
         { key: 'slots', label: <Link to='/dashboard'>Сохранённые слоты</Link>, path: '/dashboard' },
         { key: 'import expenses', label: <Link to='/import-pdf'>Импорт трат</Link>, path: '/import-pdf' }
      ];

      if (token) {
         initialItems.push({
            key: 'logout', label: <Button type='link' onClick={handleLogoutButton} className={styles.logoutButton}>Выйти из профиля</Button>, path: '/'
         });
      }
      else {
         initialItems.push({
            key: 'auth', label: <Link to='/auth'>Войти/зарегистрироваться</Link>, path: '/auth'
         });
      }

      return initialItems;
   }, [token]);

   return (
      <Header className={styles.container}>
         <h1>Budget tracker</h1>
         <Menu mode='horizontal' items={menuItems} className={styles.menu} />
         <Flex align='center'>
            <ThemeSwitcher />
         </Flex>
      </Header>
   )
}

export default HeaderBar;