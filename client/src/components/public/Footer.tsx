import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid sm:grid-cols-4 gap-8">
        <div className="sm:col-span-2">
          <h3 className="font-bold text-slate-900 text-lg">JobMob</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">İş axtaranları və işəgötürənləri bir araya gətirən platforma.</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/jobs" className="hover:text-indigo-600">Vakansiyalar</Link></li>
            <li><Link href="/sign-up" className="hover:text-indigo-600">Qeydiyyat</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Şirkət</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="#" className="hover:text-indigo-600">Haqqımızda</Link></li>
            <li><Link href="#" className="hover:text-indigo-600">Əlaqə</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">© {new Date().getFullYear()} JobMob. Bütün hüquqlar qorunur.</div>
    </footer>
  );
}