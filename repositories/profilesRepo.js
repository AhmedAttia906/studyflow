export async function getProfileByUserId(supabase, userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return { data, error };
}

export async function createProfile(supabase, profile) {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  return { data, error };
}

export async function updateProfile(supabase, profileId, userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profileId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error };
}
