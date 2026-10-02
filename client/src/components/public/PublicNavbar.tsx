'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-slate-900">JobMob</Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/jobs" className="text-sm font-medium text-slate-600 hover:text-slate-900">Vakansiyalar</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">Daxil ol</Link>
          <Link href="/sign-up" className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Qeydiyyat</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-slate-700">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 px-4 py-4 space-y-3 bg-white">
          <Link href="/jobs" className="block text-sm font-medium text-slate-600">Vakansiyalar</Link>
          <Link href="/sign-in" className="block text-sm font-medium text-slate-600">Daxil ol</Link>
          <Link href="/sign-up" className="block text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">Qeydiyyat</Link>
        </div>
      )}
    </header>
  );
}