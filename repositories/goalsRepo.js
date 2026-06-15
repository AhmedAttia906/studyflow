export async function createGoal(supabase, goal) {
  const { data, error } = await supabase
    .from("goals")
    .insert(goal)
    .select()
    .single();

  return { data, error };
}

export async function getGoals(supabase, user_id) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: true });

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
  const { data, error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", userId)
    .select();

  return { data, error };
}
