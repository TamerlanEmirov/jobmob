'use client';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useToggleSaveJob } from '@/hooks/useToggleSaveJob';
import JobCard from '@/components/jobs/JobCard';
import { Bookmark } from 'lucide-react';

export default function SavedJobsPage() {
  const { data: jobs, isLoading, error } = useSavedJobs();
  const { unsave } = useToggleSaveJob();

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Saxlanılan elanlar</h2>

      {isLoading && <p className="text-slate-500 text-sm">Yüklənir...</p>}
      {error && <p className="text-red-500 text-sm">Xəta baş verdi.</p>}
      {jobs?.length === 0 && (
        <div className="text-center py-16">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Hələ heç bir elan saxlamamısınız.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {jobs?.map((job: any) => (
          <JobCard key={job.id} job={job} href={`/dashboard/job-seeker/jobs/${job.id}`} isSaved={true} onToggleSave={() => unsave.mutate(job.id)} />
        ))}
      </div>
    </main>
  );
}