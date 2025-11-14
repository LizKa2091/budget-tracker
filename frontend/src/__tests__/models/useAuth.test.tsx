import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegisterUser, useLoginUser, useLogoutUser, useForgotPassword, useResetPassword } from '../../features/auth/model/useAuth';
import { tokenAxios } from '../../shared/api/axios';

vi.mock('../../shared/api/axios', () => ({
   tokenAxios: {
      post: vi.fn(),
      get: vi.fn()
   }
}));

const createWrapper = () => {
   const queryClient = new QueryClient();

   return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
};

describe('useAuth tests', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('useRegisterUser calls axios.post and returns data', async () => {
      const mockData = { id: 1, email: 'test@test.com' };
      tokenAxios.post.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useRegisterUser(), { wrapper: createWrapper() });

      result.current.mutate({ email: 'a', password: 'b', name: 'c' });

      await waitFor(() => result.current.isSuccess);

      expect(tokenAxios.post).toHaveBeenCalledWith('/register', { email: 'a', password: 'b', name: 'c' });
      expect(result.current.data).toEqual(mockData);
   });

   test('useLoginUser calls axios.post and returns data', async () => {
      const mockData = { token: 'abc' };
      tokenAxios.post.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useLoginUser(), { wrapper: createWrapper() });
      result.current.mutate({ email: 'x', password: 'y' });

      await waitFor(() => result.current.isSuccess);
      expect(tokenAxios.post).toHaveBeenCalledWith('/login', { email: 'x', password: 'y' });
      expect(result.current.data).toEqual(mockData);
   });

   test('useLogoutUser calls axios post', async () => {
      const mockData = { success: true };
      tokenAxios.post.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useLogoutUser(), { wrapper: createWrapper() });
      result.current.mutate();

      await waitFor(() => result.current.isSuccess);
      expect(tokenAxios.post).toHaveBeenCalledWith('/logout');
      expect(result.current.data).toEqual(mockData);
   });

   test('useForgotPassword calls axios post', async () => {
      const mockData = { resetToken: 'token123' };
      tokenAxios.post.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() });
      result.current.mutate({ email: 'a@b.com' });

      await waitFor(() => result.current.isSuccess);
      expect(tokenAxios.post).toHaveBeenCalledWith('/forgot-password', { email: 'a@b.com' });
      expect(result.current.data).toEqual(mockData);
   });

   test('useResetPassword calls axios post', async () => {
      const mockData = { success: true };
      tokenAxios.post.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });
      result.current.mutate({ token: 't', newPassword: 'p' });

      await waitFor(() => result.current.isSuccess);
      expect(tokenAxios.post).toHaveBeenCalledWith('/reset-password', { token: 't', newPassword: 'p' });
      expect(result.current.data).toEqual(mockData);
   });
});
