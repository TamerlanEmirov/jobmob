'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';
import { CreateJobInput, Job } from '@/types/job';

export function useCreateJob() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateJobInput): Promise<Job> => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.post('/jobs', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}