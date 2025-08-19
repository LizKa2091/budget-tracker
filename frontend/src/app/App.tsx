import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChartExports from "../shared/context/ChartContext";
import ThemeExports from "../shared/context/ThemeContext";

const { ChartContextProvider } = ChartExports;
const { ThemeProvider } = ThemeExports;

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider>
            <ChartContextProvider>
               <Router />
            </ChartContextProvider>
         </ThemeProvider>
      </QueryClientProvider>
   )
}

export default App;