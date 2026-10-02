'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useUpdateCompany() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name?: string; description?: string; category?: string }) => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.patch('/companies/me', data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
}