import { auth } from '@clerk/nextjs/server';

export type ServerUser = {
  id: string;
  email: string;
  role: 'JOB_SEEKER' | 'EMPLOYER';
  fullName?: string | null;
  skills?: string[];
  experienceYears?: number | null;
  company?: { id: string; name: string; category: string; description?: string | null } | null;
};

export async function getServerUser() {
  const { userId, getToken } = await auth();
  if (!userId) return { authenticated: false as const, user: null };

  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  // 404 = login olub, amma DB-də profili yoxdur (onboarding bitməyib)
  if (!res.ok) return { authenticated: true as const, user: null };

  const json = await res.json();
  return { authenticated: true as const, user: json.data as ServerUser };
}