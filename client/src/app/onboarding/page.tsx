'use client';

import { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { api, setAuthToken } from '@/lib/api';
import { Building2, UserCheck, ArrowLeft } from 'lucide-react';

type Role = 'JOB_SEEKER' | 'EMPLOYER';

export default function OnboardingPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyCategory, setCompanyCategory] = useState('');

  const isValid =
    role === 'JOB_SEEKER' ? fullName.trim().length > 0 : companyName.trim().length > 0 && companyCategory.trim().length > 0;

  const selectRole = (r: Role) => {
    setVisible(false);
    setTimeout(() => {
      setRole(r);
      setVisible(true);
    }, 150);
  };

  const goBack = () => {
    setVisible(false);
    setTimeout(() => {
      setRole(null);
      setVisible(true);
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !user || !isValid) return;

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      setAuthToken(token);

      const payload = {
        email: user.primaryEmailAddress?.emailAddress,
        role,
        ...(role === 'JOB_SEEKER'
          ? {
              fullName,
              bio,
              skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
              experienceYears: experienceYears ? Number(experienceYears) : undefined,
            }
          : { companyName, companyDescription, companyCategory }),
      };

      const res = await api.post('/users/sync', payload);
      if (res.data.success) router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sinxronizasiya zamanı xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center gap-2 max-w-[160px] mx-auto mb-3">
            <div className="h-1.5 flex-1 rounded-full bg-indigo-600" />
            <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${role ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          </div>
          <p className="text-sm font-medium text-indigo-600 mb-2">Addım {role ? '2' : '1'} / 2</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {role ? (role === 'JOB_SEEKER' ? 'Profilinizi tamamlayın' : 'Şirkətinizi təqdim edin') : 'Platformada rolunuzu seçin'}
          </h2>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200">
          <div className={`transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {!role ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => selectRole('JOB_SEEKER')}
                  className="group p-6 border-2 border-slate-200 rounded-xl flex flex-col items-center text-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/40 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserCheck size={22} />
                  </div>
                  <span className="font-semibold text-slate-900">İş axtarıram</span>
                  <span className="text-xs text-slate-500">Vakansiyalara müraciət edin</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole('EMPLOYER')}
                  className="group p-6 border-2 border-slate-200 rounded-xl flex flex-col items-center text-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/40 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Building2 size={22} />
                  </div>
                  <span className="font-semibold text-slate-900">İşəgötürənəm</span>
                  <span className="text-xs text-slate-500">Vakansiya yerləşdirin</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 -mt-2 mb-2">
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>

                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>}

                {role === 'JOB_SEEKER' ? (
                  <>
                    <Field label="Ad və soyad">
                      <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Bacarıqlar (vergüllə ayırın)">
                      <input placeholder="React, Node.js, TypeScript" value={skills} onChange={(e) => setSkills(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Təcrübə (il)">
                      <input type="number" min={0} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Qısa bio">
                      <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className={inputClass} />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Şirkətin adı">
                      <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Kateqoriya">
                      <input required placeholder="İT, Maliyyə, Səhiyyə" value={companyCategory} onChange={(e) => setCompanyCategory(e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Şirkət haqqında">
                      <textarea rows={3} value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className={inputClass} />
                    </Field>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="w-full mt-2 bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Yadda saxlanılır...' : 'Profili tamamla'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}