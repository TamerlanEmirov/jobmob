'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Building2, ArrowRight } from 'lucide-react';

const content = {
  seeker: {
    eyebrow: 'İş axtaranlar üçün',
    headline: 'Növbəti karyera addımını burada tap',
    subtext: 'Yüzlərlə aktiv vakansiya arasından sənə uyğun olanı tap, bir kliklə müraciət et.',
    cta: 'İş axtarıram',
  },
  employer: {
    eyebrow: 'İşəgötürənlər üçün',
    headline: 'Komandana uyğun namizədi tez tap',
    subtext: 'Elanını yerləşdir, AI köməyi ilə ən uyğun namizədləri saniyələr içində gör.',
    cta: 'İşəgötürənəm',
  },
};

export default function Hero() {
  const [mode, setMode] = useState<'seeker' | 'employer'>('seeker');
  const active = content[mode];

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex rounded-full bg-white border border-slate-200 p-1 mb-6">
            <button
              onClick={() => setMode('seeker')}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-colors ${mode === 'seeker' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Search size={15} /> İş axtarıram
            </button>
            <button
              onClick={() => setMode('employer')}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full transition-colors ${mode === 'employer' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Building2 size={15} /> İşəgötürənəm
            </button>
          </div>

          <p className="text-sm font-semibold text-indigo-600 mb-3">{active.eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">{active.headline}</h1>
          <p className="text-base md:text-lg text-slate-600 mt-4 max-w-md">{active.subtext}</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              {active.cta} <ArrowRight size={16} />
            </Link>
            <Link href="/jobs" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              Vakansiyalara bax
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl rotate-2" />
          <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> AI uyğunluq nəticələri
            </div>
            {[{ title: 'Frontend Developer', match: 92 }, { title: 'Product Designer', match: 84 }, { title: 'Backend Engineer', match: 77 }].map((row) => (
              <div key={row.title} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                <span className="text-sm font-medium text-slate-800">{row.title}</span>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{row.match}% uyğun</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}