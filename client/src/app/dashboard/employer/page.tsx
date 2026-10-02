'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth, UserButton } from '@clerk/nextjs';
import { api, setAuthToken } from '@/lib/api';

export default function EmployerDashboardPage() {
  const { getToken } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get('/users/me');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Yüklənir...</p>
      </div>
    );
  }

  if (error || !user?.company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500 font-medium">Məlumatları gətirərkən xəta baş verdi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-900">{user.company.name}</h1>
        <UserButton />
      </header>

      <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Şirkət Məlumatları</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-slate-500">Kateqoriya:</span> {user.company.category}</p>
            <p><span className="font-medium text-slate-500">Təsvir:</span> {user.company.description || '—'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Elanlarım</h2>
            <p className="text-sm text-slate-500 mt-1">Hələ elan yerləşdirməmisiniz.</p>
          </div>
          <a
          
            href="/dashboard/employer/jobs/new"
            className="bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Yeni elan yerləşdir
          </a>
        </div>
      </main>
    </div>
  );
}