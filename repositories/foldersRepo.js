export async function getFolders(supabase, userId) {
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getFolderById(supabase, folderId, userId) {
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("id", folderId)
    .eq("user_id", userId)
    .single();

  return { data, error };
}

export async function createFolder(supabase, folder) {
  const { data, error } = await supabase
    .from("folders")
    .insert(folder)
    .select()
    .single();

  return { data, error };
}

export async function deleteFolder(supabase, folderId, userId) {
  const { data, error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error };
}
