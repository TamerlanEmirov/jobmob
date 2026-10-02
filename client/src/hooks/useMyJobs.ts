'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';
import { Job } from '@/types/job';

export function useMyJobs(search?: string, minSalary?: string, maxSalary?: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['my-jobs', search, minSalary, maxSalary],
    queryFn: async (): Promise<Job[]> => {
      const token = await getToken();
      setAuthToken(token);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (minSalary) params.append('minSalary', minSalary);
      if (maxSalary) params.append('maxSalary', maxSalary);

      const res = await api.get(`/jobs/my-jobs?${params.toString()}`);
      return res.data.data;
    },
    enabled: isLoaded && isSignedIn,
  });
}