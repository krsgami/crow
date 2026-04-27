import { supabase } from "../structures/Supabase.structure.js";

export async function getGuildMember(guildId: number, userId: number) {
  const { data, error } = await supabase
    .from("guild_members")
    .select("*")
    .eq("guild_id", guildId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createGuildMember(guildId: number, userId: number) {
  const { data, error } = await supabase
    .from("guild_members")
    .insert({
      guild_id: guildId,
      user_id: userId,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertGuildMember(guildId: number, userId: number) {
  const { data, error } = await supabase
    .from("guild_members")
    .upsert(
      {
        guild_id: guildId,
        user_id: userId,
      },
      { onConflict: "guild_id,user_id" },
    )
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
