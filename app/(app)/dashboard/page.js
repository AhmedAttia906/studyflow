import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/repositories/profilesRepo";

const quickActions = [
  { href: "/profile", label: "Go to Profile" },
  { href: "/calendar", label: "Go to Calendar" },
  { href: "/rooms", label: "Go to Rooms" },
  { href: "/settings", label: "Go to Settings" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const { data: profile } = await getProfileByUserId(supabase, user.id);
  const timezone = profile?.timezone || "Asia/Qatar";
  const displayName = profile?.display_name || "there";
  const today = new Intl.DateTimeFormat("en-QA", {
    dateStyle: "full",
    timeZone: timezone,
  }).format(new Date());

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Dashboard</p>
        <h1>Welcome, {displayName}</h1>
        <p>Today is {today}.</p>
      </section>

      <section className="quick-actions">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="card quick-action">
            {action.label}
          </Link>
        ))}
      </section>
    </>
  );
}
