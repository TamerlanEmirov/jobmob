'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useMe() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get('/users/me');
      return res.data.data;
    },
  });
}