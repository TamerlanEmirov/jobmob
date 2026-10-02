'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { User, Settings, LogOut } from 'lucide-react';
import { useMe } from '@/hooks/useMe';

const navItems = [
  { href: '/dashboard/employer/jobs', label: 'Elanlarım' },
  { href: '/dashboard/employer/applications', label: 'Müraciətlər' },
];

export default function EmployerNavbar({
  companyName,
}: {
  companyName: string;
}) {
  const pathname = usePathname();
  const { user: clerkUser } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { data: user } = useMe();

  const [open, setOpen] = useState(false);

  const photoUrl = user?.photoUrl;
  const fullName =
    user?.fullName ||
    clerkUser?.fullName ||
    'İstifadəçi';

  const email =
    clerkUser?.primaryEmailAddress?.emailAddress || '';

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-bold text-slate-900">
          {companyName}
        </h1>

        <nav className="flex gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-indigo-500 text-white flex items-center justify-center font-medium text-sm hover:opacity-90 transition"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profil şəkli"
              className="w-full h-full object-cover"
            />
          ) : (
            fullName.charAt(0).toUpperCase()
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            
            {/* User info */}
            <div className="px-4 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 text-white flex items-center justify-center font-medium shrink-0">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profil şəkli"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    fullName.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {fullName}
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="p-1.5">
              <Link
                href="/dashboard/employer/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                <User className="w-4 h-4 text-slate-500" />
                Profilim
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openUserProfile();
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                Manage account
              </button>
            </div>

            <div className="border-t border-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}