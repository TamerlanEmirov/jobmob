'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useUpdateApplicationStatus() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.patch(`/applications/${applicationId}/status`, { status });
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employer-applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
    },
  });
}