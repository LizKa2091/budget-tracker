import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChartExports from "../shared/context/ChartContext";

const { ChartContextProvider } = ChartExports

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <ChartContextProvider>
            <Router />
         </ChartContextProvider>
      </QueryClientProvider>
   )
}

export default App;