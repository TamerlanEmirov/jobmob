'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyJobs } from '@/hooks/useMyJobs';
import { Search, Plus, DollarSign, ChevronRight, Eye, MapPin, Briefcase } from 'lucide-react';
import { employmentTypeLabels, workModeLabels, experienceLevelLabels } from '@/lib/job-labels';
import type { Job } from '@/types/job';

export default function EmployerJobsPage() {
  const [search, setSearch] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const { data: jobs, isLoading, error } = useMyJobs(search, minSalary, maxSalary);

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Elanlarım</h2>
        <Link
          href="/dashboard/employer/jobs/new"
          className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni elan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Elan başlığına görə axtar..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            placeholder="Min Maaş"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            placeholder="Max Maaş"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {isLoading && <p className="text-slate-500 text-sm">Yüklənir...</p>}
      {error && <p className="text-red-500 text-sm">Elanları gətirərkən xəta baş verdi.</p>}
      {jobs?.length === 0 && (
        <p className="text-slate-500 text-sm">
          {search || minSalary || maxSalary
            ? 'Axtarış filtrlərinə uyğun elan tapılmadı.'
            : 'Hələ elan yerləşdirməmisiniz.'}
        </p>
      )}

      <div className="space-y-3">
        {jobs?.map((job: Job) => (
          <Link
            key={job.id}
            href={`/dashboard/employer/jobs/${job.id}`}
            className="group block bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>

                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <span className="flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                    <Briefcase size={11} /> {employmentTypeLabels[job.employmentType]}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                    {workModeLabels[job.workMode]}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                    {experienceLevelLabels[job.experienceLevel]}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 flex-wrap">
                  {job.location && (
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  )}
                  {job.salaryRange && (
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">
                      {job.salaryRange} AZN
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {job.applications?.length ?? 0} müraciət
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white px-3 py-2 rounded-lg transition-all shrink-0">
                <Eye className="w-3.5 h-3.5" />
                <span>Detallara bax</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}