export default function TrustBar() {
  const stats = [{ value: '500+', label: 'aktiv elan' }, { value: '200+', label: 'şirkət' }, { value: '1,000+', label: 'namizəd' }];
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-center sm:justify-between gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{s.value}</span>
            <span className="text-sm text-slate-500 ml-2">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}