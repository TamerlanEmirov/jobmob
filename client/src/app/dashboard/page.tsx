import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/getServerUser";

export default async function DashboardPage() {
  const { authenticated, user } = await getServerUser();

  if (!authenticated) redirect("/sign-in");
  if (!user) redirect("/onboarding");
  if (user.role === "EMPLOYER") redirect("/dashboard/employer");
  if (user.role === "JOB_SEEKER") redirect("/dashboard/job-seeker");
  redirect("/onboarding");
}