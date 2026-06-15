"use server";

import { createClient } from "@/lib/supabase/server";
import { createGoal, getGoals, deleteGoal, updateGoal } from "@/repositories/goalsRepo";

export async function createGoalAction(formData) {
  const title = formData.get("title");
  const description = formData.get("description");

  if (!title || title.trim() === "") {
    return { error: "Goal title is required." };
  }

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const goal = {
    title,
    description,
    user_id: userData.user.id,
  };

  const { data, error } = await createGoal(supabase, goal);

  if (error) {
    return { error: error.message };
  }

  return { success: true, goal: data };
}

export async function getGoalsAction() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data: goalsData, error: goalsError } = await getGoals(
    supabase,
    userData.user.id,
  );

  if (goalsError) {
    return { error: goalsError.message };
  }

  return { success: true, goals: goalsData };
}

export async function updateGoalAction(goalId, title, description) {
    if (!title || title.trim() === "") {
        return { error: "Goal title is required." };
    }

    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
        return { error: "You must be logged in." };
    }

    const { data, error } = await updateGoal(supabase, goalId, userData.user.id, { title, description });

    if (error) {
        return { error: error.message };
    }

    return { success: true, goal: data };
}

export async function deleteGoalAction(goalId) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data: goalData, error: goalError } = await deleteGoal(
    supabase,
    goalId,
    userData.user.id,
  );

  if (goalError) {
    return { error: goalError.message };
  }

  if (!goalData || goalData.length === 0) {
    return { error: "No goal was deleted. Check goal ownership or RLS." };
  }

  return { success: true };
}
