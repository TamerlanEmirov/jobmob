import { SignUp } from '@clerk/nextjs';
import AuthLayout from '@/components/auth/AuthLayout';
import { clerkAppearance } from '@/lib/clerk-appearance';

export default function SignUpPage() {
  return (
    <AuthLayout headline="Karyerana bu gün başla" subtext="Vakansiyalara müraciət et və ya komandana ən uyğun namizədi tap.">
      <SignUp fallbackRedirectUrl="/onboarding" signInFallbackRedirectUrl="/dashboard" appearance={clerkAppearance} />
    </AuthLayout>
  );
}