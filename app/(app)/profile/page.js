import ProfileForm from "@/components/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/repositories/profilesRepo";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await getProfileByUserId(
    supabase,
    userData.user.id,
  );

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Profile</p>
        <h1>Your profile</h1>
        <p>Manage the public study identity attached to your account.</p>
      </section>

      <ProfileForm profile={profile} />
    </>
  );
}
