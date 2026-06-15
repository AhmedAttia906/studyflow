"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

function validateCredentials(email, password) {
  const trimmedEmail = email?.trim();

  if (!trimmedEmail) {
    return { error: "Email is required." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  return { email: trimmedEmail };
}

export async function registerUser(email, password) {
  const validation = validateCredentials(email, password);

  if (validation.error) {
    return validation;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: validation.email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, user: data.user };
}

export async function loginUser(email, password) {
  const validation = validateCredentials(email, password);

  if (validation.error) {
    return validation;
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validation.email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, user: data.user };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.url) {
    return { error: "Could not start Google sign-in." };
  }

  return { success: true, url: data.url };
}

export async function logoutUser() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
