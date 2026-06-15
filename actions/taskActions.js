"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createTask,
  getTasksByGoal,
  getTasks,
  updateTask,
  deleteTask,
} from "@/repositories/tasksRepo";

export async function createTaskAction(formData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const goalId = formData.get("goal_id") || null;

  if (!title || title.trim() === "") {
    return { error: "Task title is required." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const task = {
    title,
    description,
    user_id: userData.user.id,
    goal_id: goalId,
  };

  const { data, error } = await createTask(supabase, task);

  if (error) {
    return { error: error.message };
  }

  return { success: true, task: data };
}

export async function getTasksByGoalAction(goalId) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await getTasksByGoal(
    supabase,
    userData.user.id,
    goalId,
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true, tasks: data };
}

export async function updateTaskAction(taskId, title, description) {
  if (!title || title.trim() === "") {
    return { error: "Task title is required." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await updateTask(supabase, taskId, userData.user.id, {
    title,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, task: data };
}

export async function completeTaskAction(taskId, status = "Done") {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const updates = { status };

  if (status === "Done") {
    updates.done_at = new Date().toISOString();
  } else {
    updates.done_at = null;
  }

  const { data, error } = await updateTask(
    supabase,
    taskId,
    userData.user.id,
    updates,
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true, task: data };
}

export async function deleteTaskAction(taskId) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await deleteTask(supabase, taskId, userData.user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true, task: data };
}

export async function getTasksAction() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await getTasks(supabase, userData.user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true, tasks: data };
}