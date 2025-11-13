import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { createTestQueryClient } from './testQueryClient';

export const TestQueryClientProvider = ({ children }: { children: ReactNode }) => {
   const client = createTestQueryClient();

   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};