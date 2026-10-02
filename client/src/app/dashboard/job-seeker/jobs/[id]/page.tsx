'use client';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, DollarSign, Building2, Loader2, CheckCircle2, Briefcase, ListChecks } from 'lucide-react';
import { useJobDetail } from '@/hooks/useJobDetails';
import { useApply } from '@/hooks/useApply';
import { useMyApplications } from '@/hooks/useMyApplications';
import { employmentTypeLabels, workModeLabels, experienceLevelLabels } from '@/lib/job-labels';

interface PageProps { params: Promise<{ id: string }> }

export default function JobSeekerJobDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: job, isLoading, isError } = useJobDetail(id);
  const { data: myApplications } = useMyApplications();
  const applyMutation = useApply();

  const alreadyApplied = myApplications?.some((app: any) => app.jobId === id);

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;
  if (isError || !job) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Elan tapılmadı</h2>
      <Link href="/dashboard/job-seeker/jobs" className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-medium"><ArrowLeft size={18} /> Elanlara qayıt</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/dashboard/job-seeker/jobs" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium mb-6"><ArrowLeft size={18} /> Elanlara qayıt</Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            <Briefcase size={11} /> {employmentTypeLabels[job.employmentType]}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">{workModeLabels[job.workMode]}</span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">{experienceLevelLabels[job.experienceLevel]}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{job.title}</h1>
        <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm"><Building2 size={16} className="text-indigo-600" /><span>{job.company?.name}</span></div>

        <div className="flex gap-6 mt-4 text-sm text-slate-600">
          {job.location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>}
          {job.salaryRange && <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salaryRange} AZN</span>}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="prose max-w-none text-slate-700 whitespace-pre-line">{job.description}</div>
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Bacarıqlar</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: string) => (
                <span key={skill} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {job.responsibilities?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3"><ListChecks size={16} className="text-indigo-600" /> Öhdəliklər</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3"><CheckCircle2 size={16} className="text-indigo-600" /> Tələblər</h2>
            <ul className="space-y-2">
              {job.requirements.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-100">
          {alreadyApplied ? (
            <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm"><CheckCircle2 size={18} /> Bu elana artıq müraciət etmisiniz</div>
          ) : (
            <button onClick={() => applyMutation.mutate(id)} disabled={applyMutation.isPending} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors disabled:opacity-50">
              {applyMutation.isPending ? 'Göndərilir...' : 'Müraciət et'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}