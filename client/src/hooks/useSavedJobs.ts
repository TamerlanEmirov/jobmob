'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useSavedJobs() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['saved-jobs'],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get('/saved-jobs/my');
      return res.data.data;
    },
  });
}