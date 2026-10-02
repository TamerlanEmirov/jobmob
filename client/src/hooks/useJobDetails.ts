'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Job } from '@/types/job';

export function useJobDetail(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async (): Promise<Job> => {
      const res = await api.get(`/jobs/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}