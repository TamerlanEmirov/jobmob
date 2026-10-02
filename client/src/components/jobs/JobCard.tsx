import Link from 'next/link';
import { MapPin, Briefcase, Bookmark } from 'lucide-react';
import { employmentTypeLabels, workModeLabels } from '@/lib/job-labels';
import type { Job } from '@/types/job';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'indicə';
  if (hours < 24) return `${hours} saat əvvəl`;
  return `${Math.floor(hours / 24)} gün əvvəl`;
}

type JobCardProps = { job: Job; href: string; isSaved?: boolean; onToggleSave?: () => void };

export default function JobCard({ job, href, isSaved, onToggleSave }: JobCardProps) {
  return (
    <Link href={href} className="group relative block bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
      {onToggleSave && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave();
          }}
          aria-label={isSaved ? 'Saxlanılanlardan çıxar' : 'Saxla'}
          className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors ${isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
        >
          <Bookmark size={18} className={isSaved ? 'fill-indigo-600' : ''} />
        </button>
      )}

      <div className="flex items-start gap-4 pr-8">
        <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg font-bold shrink-0">
          {job.company?.name?.charAt(0) ?? '?'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{job.company?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-4">
        <span className="flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
          <Briefcase size={11} /> {employmentTypeLabels[job.employmentType]}
        </span>
        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">{workModeLabels[job.workMode]}</span>
        {job.location && (
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <MapPin size={12} /> {job.location}
          </span>
        )}
        {job.salaryRange && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md tabular-nums">{job.salaryRange} AZN</span>
        )}
      </div>

      <p className="text-sm text-slate-500 mt-4 line-clamp-2 leading-relaxed">{job.description}</p>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400">{timeAgo(job.createdAt)}</span>
        <span className="text-xs font-semibold text-indigo-600 group-hover:underline">Ətraflı bax →</span>
      </div>
    </Link>
  );
}