export async function getSettingsByUserId(supabase, userId) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return { data, error };
}

export async function createSettings(supabase, settings) {
  const { data, error } = await supabase
    .from("user_settings")
    .insert(settings)
    .select()
    .single();

  return { data, error };
}

export async function updateSettings(supabase, settingsId, userId, updates) {
  const { data, error } = await supabase
    .from("user_settings")
    .update(updates)
    .eq("id", settingsId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error };
}
