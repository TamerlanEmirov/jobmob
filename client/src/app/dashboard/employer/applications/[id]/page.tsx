'use client';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, Briefcase, Building2, Sparkles } from 'lucide-react';
import { useApplicationDetails } from '@/hooks/useApplicationDetails';
import { useUpdateApplicationStatus } from '@/hooks/useUpdateApplicationStatus';

interface PageProps { params: Promise<{ id: string }> }

const statusLabels: Record<string, string> = { 
  PENDING: 'Gözləmədə', 
  REVIEWING: 'Baxılır', 
  ACCEPTED: 'Qəbul edilib', 
  REJECTED: 'Rədd edilib' 
};

export default function ApplicationDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: application, isLoading, isError } = useApplicationDetails(id);
  const updateStatus = useUpdateApplicationStatus();

  // 🔍 DEBUGGING: Brauzerin konsolunda (F12 -> Console) datanın tam strukturuna baxmaq üçün
  if (application) {
    console.log("Backend-dən gələn application datası:", application);
  }

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;
  if (isError || !application) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Müraciət tapılmadı</h2>
      <Link href="/dashboard/employer/applications" className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-medium"><ArrowLeft size={18} /> Müraciətlərə qayıt</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/dashboard/employer/applications" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium mb-6"><ArrowLeft size={18} /> Müraciətlərə qayıt</Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{application.applicant.fullName || 'Adı göstərilməyib'}</h1>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-2"><Mail size={14} /> {application.applicant.email}</p>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1"><Building2 size={14} /> {application.job.title} elanına müraciət</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200 shrink-0">{statusLabels[application.status]}</span>
        </div>

        {/* 🛠️ TƏHLÜKƏSİZ YOXHLAMA: matchScore-un mövcudluğunu tam əhatə edən yeni şərt */}
        {application.matchScore !== undefined && application.matchScore !== null && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-700">{application.matchScore}%</span>
              <span className="text-xs font-medium text-indigo-500">AI uyğunluq balı</span>
            </div>
            {application.matchNote && (
              <p className="text-sm text-indigo-900 mt-2 leading-relaxed">{application.matchNote}</p>
            )}
          </div>
        )}

        <div className="py-6 space-y-3">
          {application.applicant.experienceYears != null && <p className="flex items-center gap-1.5 text-sm text-slate-600"><Briefcase size={16} /> {application.applicant.experienceYears} il təcrübə</p>}
          {application.applicant.skills?.length > 0 && <p className="text-sm text-slate-600">Bacarıqlar: {application.applicant.skills.join(', ')}</p>}
          {application.applicant.bio && <p className="text-sm text-slate-700 whitespace-pre-line">{application.applicant.bio}</p>}
        </div>

        <div className="flex gap-2 pt-6 border-t border-slate-100">
          <button onClick={() => updateStatus.mutate({ applicationId: id, status: 'ACCEPTED' })} disabled={updateStatus.isPending || application.status === 'ACCEPTED'} className="text-sm font-medium px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50">Qəbul et</button>
          <button onClick={() => updateStatus.mutate({ applicationId: id, status: 'REJECTED' })} disabled={updateStatus.isPending || application.status === 'REJECTED'} className="text-sm font-medium px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50">Rədd et</button>
          <button onClick={() => updateStatus.mutate({ applicationId: id, status: 'REVIEWING' })} disabled={updateStatus.isPending || application.status === 'REVIEWING'} className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50">Baxılır kimi işarələ</button>
        </div>
      </div>
    </div>
  );
}
