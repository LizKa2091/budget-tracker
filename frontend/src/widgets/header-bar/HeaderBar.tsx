import { type FC } from 'react';
import { Layout, Menu } from 'antd';
import styles from './HeaderBar.module.scss';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const menuItems = [
    { key: 'main', label: <Link to='/'>Главная</Link>, path: '/' }, 
    { key: 'slots', label: <Link to='/dashboard'>Сохранённые слоты</Link>, path: '/dashboard' }, 
    { key: 'import expenses', label: <Link to='/import-pdf'>Импорт трат</Link>, path: '/import-pdf' }
];

const HeaderBar: FC = () => {
    return (
        <Header className={styles.container}>
            <h1>Budget tracker</h1>
            <Menu mode='horizontal' items={menuItems} className={styles.menu} />
        </Header>
    )
}

export default HeaderBar;