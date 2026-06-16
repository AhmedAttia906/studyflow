export async function createTask(supabase, task) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();

  return { data, error };
}

export async function getTasks(supabase, userId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getTasksWithoutFolder(supabase, userId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .is("folder_id", null)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getTasksByFolder(supabase, userId, folderId) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function updateTask(supabase, taskId, userId, updates) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteTask(supabase, taskId, userId) {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId)
    .select();

  return { data, error };
}

export async function deleteTasksByFolder(supabase, userId, folderId) {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("user_id", userId)
    .eq("folder_id", folderId)
    .select();

  return { data, error };
}
