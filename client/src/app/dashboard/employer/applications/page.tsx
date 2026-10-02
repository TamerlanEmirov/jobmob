'use client';
import Link from 'next/link';
import { Loader2, Mail } from 'lucide-react';
import { useEmployerApplications } from '@/hooks/useEmployerApplications';

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Gözləmədə', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  REVIEWING: { label: 'Baxılır', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  ACCEPTED: { label: 'Qəbul edilib', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Rədd edilib', className: 'bg-red-50 text-red-700 border-red-200' },
};

export default function EmployerApplicationsPage() {
  const { data: applications, isLoading, error } = useEmployerApplications();

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Müraciətlər</h2>

      {isLoading && <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>}
      {error && <p className="text-red-500 text-sm">Xəta baş verdi.</p>}
      {applications?.length === 0 && <p className="text-slate-500 text-sm">Hələ heç bir müraciət yoxdur.</p>}

      <div className="space-y-3">
        {applications?.map((app: any) => {
          const status = statusLabels[app.status] ?? statusLabels.PENDING;
          return (
            <Link key={app.id} href={`/dashboard/employer/applications/${app.id}`} className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <div>
                <h3 className="font-semibold text-slate-900">{app.applicant.fullName || 'Adı göstərilməyib'}</h3>
                <p className="text-sm text-slate-500 mt-1">{app.job.title}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${status.className}`}>{status.label}</span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}