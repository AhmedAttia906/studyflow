export async function getCalendarEventBySource(supabase, userId, sourceType, sourceId) {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", userId)
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .maybeSingle();

  return { data, error };
}

export async function createCalendarEvent(supabase, event) {
  const { data, error } = await supabase
    .from("calendar_events")
    .insert(event)
    .select()
    .single();

  return { data, error };
}

export async function updateCalendarEvent(supabase, eventId, userId, updates) {
  const { data, error } = await supabase
    .from("calendar_events")
    .update(updates)
    .eq("id", eventId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteCalendarEventBySource(supabase, userId, sourceType, sourceId) {
  const { data, error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("user_id", userId)
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .select();

  return { data, error };
}

export async function deleteCalendarEventsBySources(supabase, userId, sourceType, sourceIds) {
  if (!sourceIds.length) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("user_id", userId)
    .eq("source_type", sourceType)
    .in("source_id", sourceIds)
    .select();

  return { data, error };
}

export async function getUpcomingCalendarEvents(supabase, userId, limit = 8) {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", userId)
    .gte("event_time", new Date().toISOString())
    .order("event_time", { ascending: true })
    .limit(limit);

  return { data, error };
}

export async function getCalendarEventsBetween(supabase, userId, startIso, endIso) {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", userId)
    .gte("event_time", startIso)
    .lte("event_time", endIso)
    .order("event_time", { ascending: true });

  return { data, error };
}
