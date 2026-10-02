import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const matches = [
  { title: 'Frontend Developer', match: 92 },
  { title: 'Product Designer', match: 84 },
  { title: 'Backend Engineer', match: 77 },
];

export default function AuthLayout({ children, headline, subtext }: { children: React.ReactNode; headline: string; subtext: string }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900" />

        <Link href="/" className="relative font-bold text-xl text-white">JobMob</Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white leading-tight">{headline}</h2>
          <p className="text-slate-300 mt-3 max-w-sm">{subtext}</p>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <Sparkles size={14} /> AI uyğunluq nəticələri
            </div>
            {matches.map((m) => (
              <div key={m.title} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                <span className="text-sm font-medium text-white">{m.title}</span>
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-full">{m.match}% uyğun</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-400">© {new Date().getFullYear()} JobMob</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}