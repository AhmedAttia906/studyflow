"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createFolder,
  deleteFolder,
  getFolderById,
} from "@/repositories/foldersRepo";
import { deleteCalendarEventsBySources } from "@/repositories/calendarEventsRepo";
import { deleteGoalsByFolder, getGoalsByFolder } from "@/repositories/goalsRepo";
import { deleteTasksByFolder, getTasksByFolder } from "@/repositories/tasksRepo";

export async function createFolderAction(formData) {
  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim() || null;

  if (!name) {
    return { error: "Folder name is required." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await createFolder(supabase, {
    user_id: userData.user.id,
    name,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/folders");
  revalidatePath("/dashboard");

  return { success: true, folder: data };
}

export async function deleteFolderAction(folderId) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const userId = userData.user.id;
  const { data: folder, error: folderError } = await getFolderById(
    supabase,
    folderId,
    userId,
  );

  if (folderError || !folder) {
    return { error: "Folder was not found or you do not have permission to delete it." };
  }

  const [{ data: tasks = [], error: tasksError }, { data: goals = [], error: goalsError }] =
    await Promise.all([
      getTasksByFolder(supabase, userId, folderId),
      getGoalsByFolder(supabase, userId, folderId),
    ]);

  if (tasksError) {
    return { error: tasksError.message };
  }

  if (goalsError) {
    return { error: goalsError.message };
  }

  const taskEventDelete = await deleteCalendarEventsBySources(
    supabase,
    userId,
    "task",
    tasks.map((task) => task.id),
  );

  if (taskEventDelete.error) {
    return { error: taskEventDelete.error.message };
  }

  const goalEventDelete = await deleteCalendarEventsBySources(
    supabase,
    userId,
    "goal",
    goals.map((goal) => goal.id),
  );

  if (goalEventDelete.error) {
    return { error: goalEventDelete.error.message };
  }

  const taskDelete = await deleteTasksByFolder(supabase, userId, folderId);

  if (taskDelete.error) {
    return { error: taskDelete.error.message };
  }

  const goalDelete = await deleteGoalsByFolder(supabase, userId, folderId);

  if (goalDelete.error) {
    return { error: goalDelete.error.message };
  }

  const deletedFolder = await deleteFolder(supabase, folderId, userId);

  if (deletedFolder.error) {
    return { error: deletedFolder.error.message };
  }

  revalidatePath("/folders");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");

  return { success: true };
}
