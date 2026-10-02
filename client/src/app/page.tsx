import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Hero from '@/components/public/Hero';
import TrustBar from '@/components/public/TrustBar';
import HowItWorks from '@/components/public/HowItWorks';
import FeaturedJobs from '@/components/public/FeaturedJobs';
import Testimonials from '@/components/public/Testimonials';
import CtaBanner from '@/components/public/CtaBanner';

async function getFeaturedJobs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  const jobs = await getFeaturedJobs();

  return (
    <div className="min-h-screen bg-white">
     
      <Hero />
      <TrustBar />
      <HowItWorks />
      <FeaturedJobs jobs={jobs} />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}