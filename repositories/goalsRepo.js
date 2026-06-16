export async function createGoal(supabase, goal) {
  const { data, error } = await supabase
    .from("goals")
    .insert(goal)
    .select()
    .single();

  return { data, error };
}

export async function getGoals(supabase, userId) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getGoalById(supabase, goalId, userId) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", userId)
    .maybeSingle();

  return { data, error };
}

export async function getGoalsByFolder(supabase, userId, folderId) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .eq("folder_id", folderId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function updateGoal(supabase, goalId, userId, updates) {
  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", goalId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteGoal(supabase, goalId, userId) {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId);

  return { error };
}

export async function deleteGoalsByFolder(supabase, userId, folderId) {
  const { data, error } = await supabase
    .from("goals")
    .delete()
    .eq("user_id", userId)
    .eq("folder_id", folderId)
    .select();

  return { data, error };
}
