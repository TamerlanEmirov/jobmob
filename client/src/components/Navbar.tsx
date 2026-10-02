'use client';

import Link from 'next/link';
import { Show, UserButton, SignOutButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <header className="w-full max-w-3xl flex justify-between items-center p-6 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">Job Board</h2>
      
      <div className="flex items-center gap-4">
        <Show when="signed-in">
          <Link 
            href="/onboarding" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Onboarding-ə get
          </Link>
          <SignOutButton>
            <button className="text-sm font-medium text-red-600 hover:text-red-500 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30">
              Çıxış et
            </button>
          </SignOutButton>
          <UserButton />
        </Show>

        <Show when="signed-out">
          <Link 
            href="/sign-in" 
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Daxil ol
          </Link>
          <Link 
            href="/sign-up" 
            className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full dark:bg-zinc-100 dark:text-black"
          >
            Qeydiyyat
          </Link>
        </Show>
      </div>
    </header>
  );
}