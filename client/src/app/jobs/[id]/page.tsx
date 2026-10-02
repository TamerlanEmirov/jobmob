import Link from 'next/link';
import { ArrowLeft, MapPin, DollarSign, Building2, Lock } from 'lucide-react';

async function getJob(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function PublicJobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Elan tapılmadı</h2>
        <Link href="/jobs" className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-medium"><ArrowLeft size={18} /> Elanlara qayıt</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/jobs" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium mb-6"><ArrowLeft size={18} /> Elanlara qayıt</Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{job.title}</h1>
        <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm">
          <Building2 size={16} className="text-indigo-600" />
          <span>{job.company?.name}</span>
        </div>

        <div className="flex gap-6 mt-4 text-sm text-slate-600">
          {job.location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>}
          {job.salaryRange && <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salaryRange} AZN</span>}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="prose max-w-none text-slate-700 whitespace-pre-line">{job.description}</div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <Link href="/sign-in" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors">
            Müraciət et
          </Link>
          <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <Lock size={12} /> Müraciət etmək üçün daxil olmalısınız
          </p>
        </div>
      </div>
    </div>
  );
}