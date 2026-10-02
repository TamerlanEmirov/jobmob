import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/getServerUser';
import JobSeekerNavbar from '@/components/job-seeker/JobSeekerNavbar';

export default async function JobSeekerLayout({ children }: { children: React.ReactNode }) {
  const { authenticated, user } = await getServerUser();

  if (!authenticated) redirect('/sign-in');
  if (!user) redirect('/onboarding');
  if (user.role !== 'JOB_SEEKER') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      <JobSeekerNavbar fullName={user.fullName ?? 'Profil'} />
      {children}
    </div>
  );
}