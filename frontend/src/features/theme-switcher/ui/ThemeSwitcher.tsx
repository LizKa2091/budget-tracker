import { type FC } from 'react';
import ThemeExports from '../../../shared/context/ThemeContext';
import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

const { useTheme } = ThemeExports;

const ThemeSwitcher: FC = () => {
   const { theme, switchTheme } = useTheme();

   return (
      <Button onClick={switchTheme} icon={theme === 'light' ? <SunOutlined /> : <MoonOutlined />}></Button>
   )
}

export default ThemeSwitcher;