import { supabase } from "../structures/Supabase.structure.js";

export async function getUserByDiscordId(discordUserId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .single();

  if (error) throw error;
  return data;
}

export async function createUser(discordUserId: string, username: string) {
  const { data, error } = await supabase
    .from("users")
    .insert({ discord_user_id: discordUserId, username })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function upsertUser(discordUserId: string, username: string) {
  const { data, error } = await supabase
    .from("users")
    .upsert({ discord_user_id: discordUserId, username })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
