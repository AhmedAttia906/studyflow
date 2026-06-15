"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createSettings,
  getSettingsByUserId,
  updateSettings,
} from "@/repositories/settingsRepo";
import { revalidatePath } from "next/cache";

const THEMES = ["light", "dark", "system"];
const WEEK_STARTS = ["saturday", "sunday", "monday"];

export async function saveSettingsAction(settingsInput) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: "You must be logged in." };
  }

  const theme = THEMES.includes(settingsInput.theme)
    ? settingsInput.theme
    : "system";
  const week_start = WEEK_STARTS.includes(settingsInput.week_start)
    ? settingsInput.week_start
    : "saturday";

  const settings = {
    theme,
    week_start,
    updated_at: new Date().toISOString(),
  };

  const { data: existingSettings, error: settingsError } =
    await getSettingsByUserId(supabase, userData.user.id);

  if (settingsError) {
    return { error: settingsError.message };
  }

  const result = existingSettings
    ? await updateSettings(
        supabase,
        existingSettings.id,
        userData.user.id,
        settings,
      )
    : await createSettings(supabase, {
        ...settings,
        user_id: userData.user.id,
      });

  if (result.error) {
    return { error: result.error.message };
  }

  revalidatePath("/settings");

  return { success: true, settings: result.data };
}
