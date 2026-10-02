'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

const navItems = [
  { href: '/dashboard/job-seeker/jobs', label: 'Elanlar' },
  { href: '/dashboard/job-seeker/saved', label: 'Saxlanılanlar' },
  { href: '/dashboard/job-seeker/applications', label: 'Müraciətlərim' },
  { href: '/dashboard/job-seeker/profile', label: 'Profil' }
];

export default function JobSeekerNavbar({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-bold text-slate-900">{fullName}</h1>
        <nav className="flex gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <UserButton />
    </header>
  );
}