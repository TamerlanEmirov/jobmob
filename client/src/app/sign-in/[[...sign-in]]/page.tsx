import { SignIn } from '@clerk/nextjs';
import AuthLayout from '@/components/auth/AuthLayout';
import { clerkAppearance } from '@/lib/clerk-appearance';

export default function SignInPage() {
  return (
    <AuthLayout headline="Yenidən xoş gəldin" subtext="Elanlarına, müraciətlərinə və AI uyğunluq nəticələrinə davam et.">
      <SignIn fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard" appearance={clerkAppearance} />
    </AuthLayout>
  );
}