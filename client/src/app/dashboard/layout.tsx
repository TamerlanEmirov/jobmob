import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/getServerUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, user } = await getServerUser();

  if (!authenticated) {
    redirect("/sign-in");
  }

  if (!user) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}