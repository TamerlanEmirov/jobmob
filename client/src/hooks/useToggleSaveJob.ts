'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useToggleSaveJob() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });

  const save = useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken();
      setAuthToken(token);
      await api.post('/saved-jobs', { jobId });
    },
    onSuccess: invalidate,
  });

  const unsave = useMutation({
    mutationFn: async (jobId: string) => {
      const token = await getToken();
      setAuthToken(token);
      await api.delete(`/saved-jobs/${jobId}`);
    },
    onSuccess: invalidate,
  });

  return { save, unsave };
}