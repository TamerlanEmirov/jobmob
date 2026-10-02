'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export function useUploadFile(
  type: 'photo' | 'resume'
) {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const token = await getToken();

      setAuthToken(token);

      const formData = new FormData();

      formData.append('file', file);

      const res = await api.post(
        `/uploads/${type}`,
        formData
      );

      return res.data.data.url as string;
    },
  });
}