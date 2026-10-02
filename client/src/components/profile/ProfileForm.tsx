'use client';

import { useState, useEffect, useRef } from 'react';
import { useMe } from '@/hooks/useMe';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useUpdateCompany } from '@/hooks/useUpdateCompany';
import { useUploadFile } from '@/hooks/useUploadFile';
import { Code2, Camera, Phone, Loader2, User as UserIcon, Upload, FileText } from 'lucide-react';

const inputClass = 'mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

export default function ProfileForm() {
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();
  const updateCompany = useUpdateCompany();
  const photoUpload = useUploadFile('photo');
  const resumeUpload = useUploadFile('resume');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [savedMsg, setSavedMsg] = useState(false);
  const [form, setForm] = useState({
    fullName: '', bio: '', skills: '', experienceYears: '', resumeUrl: '',
    photoUrl: '', phoneNumber: '', githubUrl: '', linkedinUrl: '', instagramUrl: '',
  });
  const [companyForm, setCompanyForm] = useState({ name: '', description: '', category: '' });

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || '',
      bio: user.bio || '',
      skills: user.skills?.join(', ') || '',
      experienceYears: user.experienceYears != null ? String(user.experienceYears) : '',
      resumeUrl: user.resumeUrl || '',
      photoUrl: user.photoUrl || '',
      phoneNumber: user.phoneNumber || '',
      githubUrl: user.githubUrl || '',
      linkedinUrl: user.linkedinUrl || '',
      instagramUrl: user.instagramUrl || '',
    });
    if (user.company) {
      setCompanyForm({ name: user.company.name || '', description: user.company.description || '', category: user.company.category || '' });
    }
  }, [user]);

  const flashSaved = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await photoUpload.mutateAsync(file);
    setForm((f) => ({ ...f, photoUrl: url }));
  };

  const handleResumeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await resumeUpload.mutateAsync(file);
    setForm((f) => ({ ...f, resumeUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync({
      fullName: form.fullName || undefined,
      bio: form.bio || undefined,
      skills: user?.role === 'JOB_SEEKER' ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
      resumeUrl: form.resumeUrl || undefined,
      photoUrl: form.photoUrl || undefined,
      phoneNumber: form.phoneNumber || undefined,
      githubUrl: form.githubUrl || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      instagramUrl: form.instagramUrl || undefined,
    });
    flashSaved();
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompany.mutateAsync(companyForm);
    flashSaved();
  };

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Profil</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Şəxsi məlumatlar</h3>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 group"
          >
            {form.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photoUrl} alt="Profil şəkli" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-7 h-7 text-slate-300" />
            )}
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
              {photoUpload.isPending ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Upload className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </button>
          <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
          <div>
            <p className="text-sm font-medium text-slate-700">Profil şəkli</p>
            <p className="text-xs text-slate-400">Dəyişmək üçün şəklin üzərinə klikləyin (maks. 5MB)</p>
            {photoUpload.isError && <p className="text-xs text-red-500 mt-1">Yükləmə uğursuz oldu, yenidən cəhd edin.</p>}
          </div>
        </div>

        <Field label="Ad və soyad">
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
        </Field>

        
          <>
            <Field label="Bacarıqlar (vergüllə ayırın)">
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Təcrübə (il)">
              <input type="number" min={0} value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Qısa bio">
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} />
            </Field>

            <Field label="CV">
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={resumeUpload.isPending}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {resumeUpload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {form.resumeUrl ? 'CV-ni dəyiş' : 'CV yüklə'}
                </button>
                {form.resumeUrl && (
                  <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
                    <FileText className="w-4 h-4" /> Mövcud CV-ə bax
                  </a>
                )}
              </div>
              <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeSelect} className="hidden" />
              {resumeUpload.isError && <p className="text-xs text-red-500 mt-1">Yükləmə uğursuz oldu, yenidən cəhd edin.</p>}
            </Field>
          </>
        

        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefon">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+994 50 123 45 67" className={inputClass + ' pl-9'} />
            </div>
          </Field>
          <Field label="GitHub">
            <div className="relative">
              <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="github.com/..." className={inputClass + ' pl-9'} />
            </div>
          </Field>
          <Field label="LinkedIn">
            <div className="relative">
              <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="linkedin.com/in/..." className={inputClass + ' pl-9'} />
            </div>
          </Field>
          <Field label="Instagram">
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="instagram.com/..." className={inputClass + ' pl-9'} />
            </div>
          </Field>
        </div>

        <button type="submit" disabled={updateProfile.isPending} className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
          {updateProfile.isPending ? 'Yadda saxlanılır...' : 'Yadda saxla'}
        </button>
      </form>

      {user?.role === 'EMPLOYER' && (
        <form onSubmit={handleCompanySubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Şirkət məlumatları</h3>
          <Field label="Şirkətin adı">
            <input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Kateqoriya">
            <input value={companyForm.category} onChange={(e) => setCompanyForm({ ...companyForm, category: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Təsvir">
            <textarea rows={3} value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} className={inputClass} />
          </Field>
          <button type="submit" disabled={updateCompany.isPending} className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
            {updateCompany.isPending ? 'Yadda saxlanılır...' : 'Şirkət məlumatlarını yadda saxla'}
          </button>
        </form>
      )}

      {savedMsg && <p className="text-sm text-emerald-600 font-medium text-center">Uğurla yadda saxlanıldı.</p>}
    </div>
  );
}