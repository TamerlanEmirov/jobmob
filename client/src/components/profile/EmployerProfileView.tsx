'use client';

import { useState } from 'react';
import { useMe } from '@/hooks/useMe';
import { Pencil, Loader2, Phone, Camera } from 'lucide-react';
import ProfileForm from './ProfileForm';

export default function EmployerProfileView() {
  const { data: user, isLoading } = useMe();
  const [editing, setEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <p className="text-sm text-slate-500">
          Profil məlumatları tapılmadı.
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mb-5 text-sm text-slate-500 hover:text-slate-900"
        >
          ← Məlumatlarıma qayıt
        </button>

        <ProfileForm />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Məlumatlarım
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Profil məlumatlarınıza baxın və lazım olduqda redaktə edin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Profili redaktə et
        </button>
      </div>

      {/* Personal information */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">
            Şəxsi məlumatlar
          </h3>
        </div>

        <div className="p-6 space-y-6">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt="Profil şəkli"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-slate-400">
                  {(user.fullName || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <p className="text-base font-semibold text-slate-900">
                {user.fullName || 'Ad qeyd edilməyib'}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Employer
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InfoItem
              label="Ad və soyad"
              value={user.fullName}
            />

            <InfoItem
              label="Telefon"
              value={user.phoneNumber}
              icon={<Phone className="w-4 h-4" />}
            />

          </div>

          {/* Social */}
          {(user.githubUrl ||
            user.linkedinUrl ||
            user.instagramUrl) && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                Sosial bağlantılar
              </h4>

              <div className="flex flex-wrap gap-3">

                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span aria-hidden="true" className="w-4 h-4 text-xs font-bold">GH</span>
                    GitHub
                  </a>
                )}

                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span aria-hidden="true" className="w-4 h-4 text-xs font-bold">in</span>
                    LinkedIn
                  </a>
                )}

                {user.instagramUrl && (
                  <a
                    href={user.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Camera className="w-4 h-4" />
                    Instagram
                  </a>
                )}

              </div>
            </div>
          )}

        </div>
      </section>

      {/* Company */}
      {user.company && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">
              Şirkət məlumatları
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <InfoItem
              label="Şirkətin adı"
              value={user.company.name}
            />

            <InfoItem
              label="Kateqoriya"
              value={user.company.category}
            />

            <div className="md:col-span-2">
              <InfoItem
                label="Təsvir"
                value={user.company.description}
              />
            </div>

          </div>
        </section>
      )}

    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">
        {label}
      </p>

      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <p className="text-sm text-slate-900">
          {value || 'Qeyd edilməyib'}
        </p>
      </div>
    </div>
  );
}