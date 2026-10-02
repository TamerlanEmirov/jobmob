'use client';

import { use, useState, useEffect } from 'react';
import { useJobDetail } from '@/hooks/useJobDetails';import { useUpdateJob } from '@/hooks/useUpdateJob';
import { useDeleteJob } from '@/hooks/useDeleteJob';
import { MapPin, DollarSign, Calendar, ArrowLeft, Building2, Edit3, Trash2, Users, X, Loader2, Briefcase, CheckCircle2, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { employmentTypeLabels, workModeLabels, experienceLevelLabels } from '@/lib/job-labels';
import type { EmploymentType, WorkMode, ExperienceLevel } from '@/types/job';

interface PageProps {
  params: Promise<{ id: string }>;
}

function splitLines(text: string) {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

export default function EmployerJobDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
const { data: job, isLoading, isError } = useJobDetail(id); // useJobDetails yox  const updateJobMutation = useUpdateJob(id);
  const deleteJobMutation = useDeleteJob();
const updateJobMutation = useUpdateJob(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: 'FULL_TIME' as EmploymentType,
    workMode: 'ONSITE' as WorkMode,
    experienceLevel: 'ENTRY' as ExperienceLevel,
    skills: '',
    responsibilities: '',
    requirements: '',
    minSalary: '',
    maxSalary: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        employmentType: job.employmentType,
        workMode: job.workMode,
        experienceLevel: job.experienceLevel,
        skills: job.skills?.join(', ') || '',
        responsibilities: job.responsibilities?.join('\n') || '',
        requirements: job.requirements?.join('\n') || '',
        minSalary: job.minSalary != null ? String(job.minSalary) : '',
        maxSalary: job.maxSalary != null ? String(job.maxSalary) : '',
      });
    }
  }, [job]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateJobMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        responsibilities: splitLines(formData.responsibilities),
        requirements: splitLines(formData.requirements),
        minSalary: formData.minSalary ? Number(formData.minSalary) : undefined,
        maxSalary: formData.maxSalary ? Number(formData.maxSalary) : undefined,
      });
      setIsEditOpen(false);
    } catch (error) {
      console.error('Yenilənmə xətası:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz? Bütün müraciətlər də siləcək.')) return;
    try {
      await deleteJobMutation.mutateAsync(id);
      router.push('/dashboard/employer/jobs');
    } catch (error) {
      console.error('Silmə xətası:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        <p className="mt-3 text-slate-500 font-medium">Elan məlumatları yüklənir...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Elan tapılmadı</h2>
        <p className="text-slate-500 mt-2">Axtardığınız elan silinmiş və ya mövcud olmaya bilər.</p>
        <Link href="/dashboard/employer/jobs" className="inline-flex items-center gap-2 mt-6 text-indigo-600 hover:text-indigo-800 font-medium transition">
          <ArrowLeft size={18} /> Elanlarıma qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/dashboard/employer/jobs" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition mb-6">
        <ArrowLeft size={18} /> Elanlarıma qayıt
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                <Briefcase size={11} /> {employmentTypeLabels[job.employmentType]}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                {workModeLabels[job.workMode]}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                {experienceLevelLabels[job.experienceLevel]}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{job.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm">
              <Building2 size={16} className="text-indigo-600" />
              <span>{job.company?.name || job.companyName || 'Şirkətiniz'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium text-sm rounded-xl transition">
              <Edit3 size={16} /> Redaktə et
            </button>
            <button onClick={handleDelete} disabled={deleteJobMutation.isPending} className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-xl transition disabled:opacity-50">
              {deleteJobMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Sil
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Maaş</p>
              <p className="text-sm font-semibold text-slate-800">{job.salaryRange ? `${job.salaryRange} AZN` : 'Razılaşma yolu ilə'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><MapPin size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Yerləşmə</p>
              <p className="text-sm font-semibold text-slate-800">{job.location || 'Qeyd olunmayıb'}</p>
            </div>
          </div>

          <Link href={`/dashboard/employer/jobs/${id}/applicants`} className="flex items-center gap-3 hover:opacity-70 transition">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Müraciətlər</p>
              <p className="text-sm font-semibold text-slate-800">{job.applications?.length ?? 0} nəfər</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Calendar size={20} /></div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Yaradılıb</p>
              <p className="text-sm font-semibold text-slate-800">{job.createdAt ? new Date(job.createdAt).toLocaleDateString('az-AZ') : 'Bugün'}</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Elanın Məzmunu</h2>
          <div className="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
            {job.description}
          </div>
        </div>

        {job.skills?.length > 0 && (
          <div className="pt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Bacarıqlar</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {job.responsibilities?.length > 0 && (
          <div className="pt-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3"><ListChecks size={18} className="text-indigo-600" /> Öhdəliklər</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="pt-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-3"><CheckCircle2 size={18} className="text-indigo-600" /> Tələblər</h2>
            <ul className="space-y-2">
              {job.requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Elanı Redaktə Et</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Elan Başlığı</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={modalInputClass} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Məşğulluq</label>
                  <select value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })} className={modalInputClass}>
                    {Object.entries(employmentTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Format</label>
                  <select value={formData.workMode} onChange={(e) => setFormData({ ...formData, workMode: e.target.value as WorkMode })} className={modalInputClass}>
                    {Object.entries(workModeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Təcrübə</label>
                  <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })} className={modalInputClass}>
                    {Object.entries(experienceLevelLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Məkan</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={modalInputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bacarıqlar (vergüllə)</label>
                  <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className={modalInputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Maaş (AZN)</label>
                  <input type="number" value={formData.minSalary} onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })} className={modalInputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Maaş (AZN)</label>
                  <input type="number" value={formData.maxSalary} onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })} className={modalInputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ətraflı Məlumat</label>
                <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={modalInputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Öhdəliklər (hər sətirdə bir dənə)</label>
                <textarea rows={3} value={formData.responsibilities} onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })} className={modalInputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tələblər (hər sətirdə bir dənə)</label>
                <textarea rows={3} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className={modalInputClass} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition">Ləğv et</button>
                <button type="submit" disabled={updateJobMutation.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50">
                  {updateJobMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Yadda saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalInputClass = 'w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-500';