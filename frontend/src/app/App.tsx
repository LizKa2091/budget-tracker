import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeExports from "../shared/context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "../features/chart-store";

const { ThemeProvider } = ThemeExports;

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <Provider store={store}>
         <QueryClientProvider client={queryClient}>
            <ThemeProvider>
               <Router />
            </ThemeProvider>
         </QueryClientProvider>
      </Provider>
   )
}

export default App;