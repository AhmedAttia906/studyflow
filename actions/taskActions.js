"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createTask, deleteTask, updateTask } from "@/repositories/tasksRepo";
import {
  createCalendarEvent,
  deleteCalendarEventBySource,
  getCalendarEventBySource,
  updateCalendarEvent,
} from "@/repositories/calendarEventsRepo";

function cleanOptionalDate(value) {
  const trimmed = value?.trim();
  return trimmed ? new Date(trimmed).toISOString() : null;
}

async function syncTaskCalendarEvent(supabase, userId, task) {
  if (!task.deadline_at) {
    const deleted = await deleteCalendarEventBySource(
      supabase,
      userId,
      "task",
      task.id,
    );
    return deleted.error;
  }

  const { data: existingEvent, error: eventError } = await getCalendarEventBySource(
    supabase,
    userId,
    "task",
    task.id,
  );

  if (eventError) {
    return eventError;
  }

  const event = {
    user_id: userId,
    title: task.title,
    event_time: task.deadline_at,
    source_type: "task",
    source_id: task.id,
  };

  const result = existingEvent
    ? await updateCalendarEvent(supabase, existingEvent.id, userId, {
        title: event.title,
        event_time: event.event_time,
        updated_at: new Date().toISOString(),
      })
    : await createCalendarEvent(supabase, event);

  return result.error;
}

function revalidateSprint2Paths(folderId) {
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/folders");

  if (folderId) {
    revalidatePath(`/folders/${folderId}`);
  }
}

export async function createTaskAction(formData) {
  const title = formData.get("title")?.trim();
  const description = formData.get("description")?.trim() || null;
  const folderId = formData.get("folder_id") || null;
  const deadlineAt = cleanOptionalDate(formData.get("deadline_at"));

  if (!title) {
    return { error: "Task title is required." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await createTask(supabase, {
    user_id: userData.user.id,
    folder_id: folderId,
    title,
    description,
    status: "Todo",
    deadline_at: deadlineAt,
  });

  if (error) {
    return { error: error.message };
  }

  const calendarError = await syncTaskCalendarEvent(
    supabase,
    userData.user.id,
    data,
  );

  if (calendarError) {
    return { error: calendarError.message };
  }

  revalidateSprint2Paths(folderId);

  return { success: true, task: data };
}

export async function updateTaskStatusAction(taskId, status, folderId = null) {
  const nextStatus = status === "Done" ? "Done" : "Todo";
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await updateTask(supabase, taskId, userData.user.id, {
    status: nextStatus,
  });

  if (error) {
    return { error: error.message };
  }

  const calendarError =
    nextStatus === "Done"
      ? (
          await deleteCalendarEventBySource(
            supabase,
            userData.user.id,
            "task",
            data.id,
          )
        ).error
      : await syncTaskCalendarEvent(supabase, userData.user.id, data);

  if (calendarError) {
    return { error: calendarError.message };
  }

  revalidateSprint2Paths(folderId || data.folder_id);

  return { success: true, task: data };
}

export async function deleteTaskAction(taskId, folderId = null) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const calendarDelete = await deleteCalendarEventBySource(
    supabase,
    userData.user.id,
    "task",
    taskId,
  );

  if (calendarDelete.error) {
    return { error: calendarDelete.error.message };
  }

  const { data, error } = await deleteTask(supabase, taskId, userData.user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateSprint2Paths(folderId);

  return { success: true, task: data?.[0] };
}


