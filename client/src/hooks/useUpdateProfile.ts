'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useUpdateProfile() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.patch('/users/me', data);
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });
}