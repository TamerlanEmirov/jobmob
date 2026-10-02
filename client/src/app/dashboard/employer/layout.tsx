import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/getServerUser";
import EmployerNavbar from "@/components/employer/EmployerNavbar";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, user } = await getServerUser();

  if (!authenticated) redirect("/sign-in");
  if (!user) redirect("/onboarding");
  if (user.role !== "EMPLOYER") redirect("/dashboard/job-seeker");

  return (
    <div className="min-h-screen bg-slate-50">
      <EmployerNavbar companyName={user.company?.name ?? "Şirkət"} />
      {children}
    </div>
  );
}