'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useApplicationDetails(applicationId: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get(`/applications/${applicationId}`);
      return res.data.data;
    },
  });
}