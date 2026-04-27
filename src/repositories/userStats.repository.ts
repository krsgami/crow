import { supabase } from "../structures/Supabase.structure.js";
import type { Database } from "../types/Database.js";

type UserStatsRow = Database["public"]["Tables"]["user_stats"]["Row"];
type UserStatsInsert = Database["public"]["Tables"]["user_stats"]["Insert"];
type UserStatsUpdate = Database["public"]["Tables"]["user_stats"]["Update"];

export async function getUserStatsByUserId(
  userId: number,
): Promise<UserStatsRow | null> {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createUserStats(userId: number): Promise<UserStatsRow> {
  const payload: UserStatsInsert = { user_id: userId };

  const { data, error } = await supabase
    .from("user_stats")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStats(
  userId: number,
  updates: UserStatsUpdate,
): Promise<UserStatsRow> {
  const payload: UserStatsUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_stats")
    .update(payload)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
