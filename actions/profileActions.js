"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createProfile,
  getProfileByUserId,
  updateProfile,
} from "@/repositories/profilesRepo";
import { revalidatePath } from "next/cache";

export async function saveProfileAction(profileInput) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const timezone = profileInput.timezone?.trim() || "Asia/Qatar";
  const profile = {
    display_name: profileInput.display_name?.trim() || null,
    username: profileInput.username?.trim() || null,
    bio: profileInput.bio?.trim() || null,
    timezone,
    updated_at: new Date().toISOString(),
  };

  const { data: existingProfile, error: profileError } = await getProfileByUserId(
    supabase,
    userData.user.id,
  );

  if (profileError) {
    return { error: profileError.message };
  }

  const result = existingProfile
    ? await updateProfile(supabase, existingProfile.id, userData.user.id, profile)
    : await createProfile(supabase, {
        ...profile,
        user_id: userData.user.id,
      });

  if (result.error) {
    return { error: result.error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return { success: true, profile: result.data };
}
