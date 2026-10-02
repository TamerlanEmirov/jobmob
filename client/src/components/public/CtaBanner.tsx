import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Növbəti addımı bu gün at</h2>
        <p className="text-slate-300 mt-3 max-w-lg mx-auto">İstər iş axtar, istər namizəd tap — qeydiyyat 2 dəqiqə çəkir.</p>
        <Link href="/sign-up" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg mt-6 hover:bg-indigo-700 transition-colors">
          Pulsuz qeydiyyatdan keç
        </Link>
      </div>
    </section>
  );
}