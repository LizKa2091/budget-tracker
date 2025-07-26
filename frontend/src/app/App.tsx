import type { FC } from "react";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: FC = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <Router />
      </QueryClientProvider>
   )
}

export default App;