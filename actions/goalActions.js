"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createGoal, deleteGoal, getGoalById } from "@/repositories/goalsRepo";
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

async function syncGoalCalendarEvent(supabase, userId, goal) {
  if (!goal.deadline_at) {
    const deleted = await deleteCalendarEventBySource(
      supabase,
      userId,
      "goal",
      goal.id,
    );
    return deleted.error;
  }

  const { data: existingEvent, error: eventError } = await getCalendarEventBySource(
    supabase,
    userId,
    "goal",
    goal.id,
  );

  if (eventError) {
    return eventError;
  }

  const event = {
    user_id: userId,
    title: goal.title,
    event_time: goal.deadline_at,
    source_type: "goal",
    source_id: goal.id,
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

export async function createGoalAction(formData) {
  const title = formData.get("title")?.trim();
  const description = formData.get("description")?.trim() || null;
  const folderId = formData.get("folder_id") || null;
  const deadlineAt = cleanOptionalDate(formData.get("deadline_at"));

  if (!title) {
    return { error: "Goal title is required." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data, error } = await createGoal(supabase, {
    user_id: userData.user.id,
    folder_id: folderId,
    title,
    description,
    deadline_at: deadlineAt,
  });

  if (error) {
    return { error: error.message };
  }

  const calendarError = await syncGoalCalendarEvent(
    supabase,
    userData.user.id,
    data,
  );

  if (calendarError) {
    return { error: calendarError.message };
  }

  revalidateSprint2Paths(folderId);

  return { success: true, goal: data };
}

export async function deleteGoalAction(goalId, folderId = null) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const { data: existingGoal, error: getGoalError } = await getGoalById(
    supabase,
    goalId,
    userData.user.id,
  );

  if (getGoalError) {
    return { error: getGoalError.message };
  }

  if (!existingGoal) {
    return { error: "Goal was not found or you do not have permission to delete it." };
  }

  const { error } = await deleteGoal(supabase, goalId, userData.user.id);

  if (error) {
    return { error: error.message };
  }

  const { data: remainingGoal, error: verifyError } = await getGoalById(
    supabase,
    goalId,
    userData.user.id,
  );

  if (verifyError) {
    return { error: verifyError.message };
  }

  if (remainingGoal) {
    return { error: "Goal delete did not remove the row. Check the goals DELETE RLS policy." };
  }

  const calendarDelete = await deleteCalendarEventBySource(
    supabase,
    userData.user.id,
    "goal",
    goalId,
  );

  if (calendarDelete.error) {
    return { error: calendarDelete.error.message };
  }

  revalidateSprint2Paths(folderId || existingGoal.folder_id);

  return { success: true, goal: existingGoal };
}

