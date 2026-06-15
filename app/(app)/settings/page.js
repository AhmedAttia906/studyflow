import SettingsForm from "@/components/SettingsForm";
import { createClient } from "@/lib/supabase/server";
import { getSettingsByUserId } from "@/repositories/settingsRepo";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  const { data: settings } = await getSettingsByUserId(supabase, user.id);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Settings</p>
        <h1>Settings</h1>
        <p>Manage your app preferences and account access.</p>
      </section>

      <SettingsForm email={user.email} settings={settings} />
    </>
  );
}
