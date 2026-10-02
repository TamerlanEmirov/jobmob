'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAllJobs } from '@/hooks/useAllJobs';
import { Search, MapPin, DollarSign } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';

export default function PublicJobsPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const { data: jobs, isLoading, error } = useAllJobs(search, location, minSalary, maxSalary);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Vakansiyalar</h1>
        <p className="text-slate-500 mt-1">{jobs?.length ?? 0} aktiv elan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Vəzifə axtar..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Yer" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder="Min Maaş" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder="Max Maaş" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
        </div>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">Yüklənir...</p>}
      {error && <p className="text-red-500 text-sm">Xəta baş verdi.</p>}
      {jobs?.length === 0 && <p className="text-slate-500 text-sm">Uyğun elan tapılmadı.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs?.map((job: any) => (
              <JobCard key={job.id} job={job} href={`/jobs/${job.id}`} />

        ))}
      </div>
    </main>
  );
}