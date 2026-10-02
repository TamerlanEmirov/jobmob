import Link from 'next/link';
import JobCard from '@/components/jobs/JobCard';

type Job = { id: string; title: string; description: string; location?: string | null; salaryRange?: string | null; createdAt: string; company?: { name: string } };

export default function FeaturedJobs({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null;

  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ən son vakansiyalar</h2>
          <Link href="/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Hamısına bax →</Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {jobs.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} href={`/jobs/${job.id}`} />
          ))}
        </div>
      </div>
    </section>
  );
}