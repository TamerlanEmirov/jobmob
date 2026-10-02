'use client';
import { useState } from 'react';
import { useAllJobs } from '@/hooks/useAllJobs';
import JobCard from '@/components/jobs/JobCard';
import { Search, MapPin, DollarSign } from 'lucide-react';
import { employmentTypeLabels, workModeLabels } from '@/lib/job-labels';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useToggleSaveJob } from '@/hooks/useToggleSaveJob';

export default function JobSeekerJobsPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [workMode, setWorkMode] = useState('');
const { data: savedJobs } = useSavedJobs();
const { save, unsave } = useToggleSaveJob();
const savedIds = new Set((savedJobs ?? []).map((j: any) => j.id));
  const { data: jobs, isLoading, error } = useAllJobs(search, location, minSalary, maxSalary, employmentType, workMode);

  return (
    <main className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">Vakansiyalar</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Vəzifə axtar..." className={filterInputClass + ' pl-10'} />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Yer" className={filterInputClass + ' pl-10'} />
        </div>
        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={filterInputClass}>
          <option value="">Bütün məşğulluq tipləri</option>
          {Object.entries(employmentTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className={filterInputClass}>
          <option value="">Bütün iş formatları</option>
          {Object.entries(workModeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder="Min Maaş" className={filterInputClass + ' pl-9'} />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder="Max Maaş" className={filterInputClass + ' pl-9'} />
        </div>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">Yüklənir...</p>}
      {error && <p className="text-red-500 text-sm">Xəta baş verdi.</p>}
      {jobs?.length === 0 && <p className="text-slate-500 text-sm">Uyğun elan tapılmadı.</p>}

      <div className="grid sm:grid-cols-2 gap-5">
       {jobs?.map((job: any) => {
    const isSaved = savedIds.has(job.id);
    return (
      <JobCard
        key={job.id}
        job={job}
        href={`/dashboard/job-seeker/jobs/${job.id}`}
        isSaved={isSaved}
        onToggleSave={() => (isSaved ? unsave.mutate(job.id) : save.mutate(job.id))}
      />
    );
  })}
      </div>
    </main>
  );
}

const filterInputClass = 'w-full pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';