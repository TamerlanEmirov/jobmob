const testimonials = [
  { name: 'Aysel M.', role: 'Frontend Developer', quote: 'İki həftəyə uyğun vakansiya tapıb işə başladım. Müraciət prosesi inanılmaz sadədir.' },
  { name: 'Rəşad Ə.', role: 'HR Manager, TechNova', quote: 'AI uyğunluq balı sayəsində CV-ləri əl ilə süzməyə vaxt itirmirik.' },
  { name: 'Nərgiz H.', role: 'UX Designer', quote: 'Platforma sadə və sürətlidir — heç bir artıq addım yoxdur.' },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">İstifadəçilərimiz nə deyir</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3 mt-5">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">{t.name.charAt(0)}</div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}