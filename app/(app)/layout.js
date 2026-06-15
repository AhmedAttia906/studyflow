import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({ children }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return <AppShell email={data.user.email}>{children}</AppShell>;
}
