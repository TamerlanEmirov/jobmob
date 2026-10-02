'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useAllJobs(
  search: string, location: string, minSalary: string, maxSalary: string,
  employmentType?: string, workMode?: string
) {
  return useQuery({
    queryKey: ['all-jobs', search, location, minSalary, maxSalary, employmentType, workMode],
    queryFn: async () => {
      const res = await api.get('/jobs', {
        params: {
          search: search || undefined,
          location: location || undefined,
          minSalary: minSalary || undefined,
          maxSalary: maxSalary || undefined,
          employmentType: employmentType || undefined,
          workMode: workMode || undefined,
        },
      });
      return res.data.data;
    },
  });
}