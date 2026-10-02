'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useEmployerApplications() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['employer-applications'],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get('/applications/employer');
      return res.data.data;
    },
  });
}