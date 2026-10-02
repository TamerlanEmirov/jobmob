'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useApply() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.post('/applications', { jobId });
      return res.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-applications'] }),
  });
}