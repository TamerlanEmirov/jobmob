'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useJobApplicants(jobId: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['job-applicants', jobId],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get(`/applications/job/${jobId}`);
      return res.data.data;
    },
  });
}