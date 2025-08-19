import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";

type theme = 'light' | 'dark';

interface IThemeContextProps {
   theme: theme;
   switchTheme: () => void;
};

interface IThemeProviderProps {
   children: ReactNode;
}

const ThemeContext = createContext<IThemeContextProps | undefined>(undefined);

const ThemeProvider: FC<IThemeProviderProps> = ({ children }) => {
   const [theme, setTheme] = useState<theme>(localStorage.getItem('theme') as theme || 'light');

   useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
   }, [theme]);

   const switchTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
   };

   return (
      <ThemeContext.Provider value={{ theme, switchTheme }}>
         {children}
      </ThemeContext.Provider>
   )
};

const useTheme = () => {
   const context = useContext(ThemeContext);

   if (!context) throw new Error('useTheme должен использоваться внутри ThemeProvider');
   return context;
};

const ThemeExports = { ThemeContext, ThemeProvider, useTheme };

export default ThemeExports;