import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeExports from "../shared/context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "../features/chart-store";
import AuthExports from "../shared/context/AuthContext";
import NotificationExports from "../shared/context/NotificationContext";

const { ThemeProvider } = ThemeExports;
const { AuthContextProvider } = AuthExports;
const { NotificationProvider } = NotificationExports;

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <Provider store={store}>
         <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
               <NotificationProvider>
                  <ThemeProvider>
                     <Router />
                  </ThemeProvider>
               </NotificationProvider>
            </AuthContextProvider>
         </QueryClientProvider>
      </Provider>
   )
}

export default App;