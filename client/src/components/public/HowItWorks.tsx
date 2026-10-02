'use client';
import { useState } from 'react';
import { UserPlus, Search, Send, Briefcase, Users, CheckCircle2 } from 'lucide-react';

const steps = {
  seeker: [
    { icon: UserPlus, title: 'Qeydiyyatdan keç', text: 'Bir neçə dəqiqəyə profilini yarat.' },
    { icon: Search, title: 'Elan tap', text: 'Bacarıqlarına uyğun vakansiyaları axtar, filtrlə.' },
    { icon: Send, title: 'Müraciət et', text: 'Bir kliklə müraciət göndər, statusunu izlə.' },
  ],
  employer: [
    { icon: Briefcase, title: 'Elan yerləşdir', text: 'Vakansiyanı bir neçə dəqiqəyə dərc et.' },
    { icon: Users, title: 'Namizədləri gör', text: 'AI köməyi ilə uyğunluq balına görə sırala.' },
    { icon: CheckCircle2, title: 'Qərar ver', text: 'Uyğun namizədi qəbul et, digərlərini rədd et.' },
  ],
};

export default function HowItWorks() {
  const [tab, setTab] = useState<'seeker' | 'employer'>('seeker');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Necə işləyir?</h2>
        <div className="inline-flex rounded-full bg-slate-100 p-1 mt-6">
          <button onClick={() => setTab('seeker')} className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${tab === 'seeker' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>İş axtaran üçün</button>
          <button onClick={() => setTab('employer')} className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${tab === 'employer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>İşəgötürən üçün</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps[tab].map((step, i) => (
          <div key={step.title} className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <step.icon size={20} />
            </div>
            <p className="text-xs font-semibold text-indigo-600 mb-1">Addım {i + 1}</p>
            <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
            <p className="text-sm text-slate-500">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}