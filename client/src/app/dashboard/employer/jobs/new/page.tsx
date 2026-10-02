'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCreateJob } from '@/hooks/useCreateJobs';
import { employmentTypeLabels, workModeLabels, experienceLevelLabels } from '@/lib/job-labels';
import type { EmploymentType, WorkMode, ExperienceLevel } from '@/types/job';

function splitLines(text: string) {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

export default function NewJobPage() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateJob();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('FULL_TIME');
  const [workMode, setWorkMode] = useState<WorkMode>('ONSITE');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('ENTRY');
  const [skills, setSkills] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    mutate(
      {
        title,
        description,
        location: location || undefined,
        employmentType,
        workMode,
        experienceLevel,
        skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        responsibilities: splitLines(responsibilities),
        requirements: splitLines(requirements),
        minSalary: minSalary ? Number(minSalary) : undefined,
        maxSalary: maxSalary ? Number(maxSalary) : undefined,
      },
      { onSuccess: () => router.push('/dashboard/employer/jobs') }
    );
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      <Link href="/dashboard/employer/jobs" className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Elanlarıma qayıt
      </Link>

      <h2 className="text-lg font-semibold text-slate-900 mb-6">Yeni elan yerləşdir</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">Elan yaradılarkən xəta baş verdi.</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700">Başlıq</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Təsvir</label>
          <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Məşğulluq tipi</label>
            <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentType)} className={inputClass}>
              {Object.entries(employmentTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">İş formatı</label>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode)} className={inputClass}>
              {Object.entries(workModeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Təcrübə səviyyəsi</label>
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)} className={inputClass}>
              {Object.entries(experienceLevelLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Yer (opsional)</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Bacarıqlar (vergüllə ayırın)</label>
            <input placeholder="React, Node.js, TypeScript" value={skills} onChange={(e) => setSkills(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Min Maaş (AZN)</label>
            <input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Max Maaş (AZN)</label>
            <input type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Öhdəliklər (hər sətirdə bir dənə)</label>
          <textarea rows={3} placeholder={'Komanda ilə əməkdaşlıq\nKod review aparmaq'} value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Tələblər (hər sətirdə bir dənə)</label>
          <textarea rows={3} placeholder={'3+ il təcrübə\nReact biliyi'} value={requirements} onChange={(e) => setRequirements(e.target.value)} className={inputClass} />
        </div>

        <button type="submit" disabled={isPending || !isValid} className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
          {isPending ? 'Yaradılır...' : 'Elanı yerləşdir'}
        </button>
      </form>
    </main>
  );
}

const inputClass = 'mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';