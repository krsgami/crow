import { supabase } from "../structures/supabase.js";
import type { Database, Json } from "../types/database.types.js";

type GuildSettingsRow = Database["public"]["Tables"]["guild_settings"]["Row"];
type GuildSettingsInsert =
  Database["public"]["Tables"]["guild_settings"]["Insert"];
type GuildSettingsUpdate =
  Database["public"]["Tables"]["guild_settings"]["Update"];

export async function getGuildSettings(
  guildId: number,
): Promise<GuildSettingsRow | null> {
  const { data, error } = await supabase
    .from("guild_settings")
    .select("*")
    .eq("guild_id", guildId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createGuildSettings(
  guildId: number,
  values?: Partial<Pick<GuildSettingsInsert, "prefix" | "locale" | "data">>,
): Promise<GuildSettingsRow> {
  const payload: GuildSettingsInsert = {
    guild_id: guildId,
    prefix: values?.prefix ?? null,
    locale: values?.locale ?? null,
    data: (values?.data ?? {}) as Json,
  };

  const { data, error } = await supabase
    .from("guild_settings")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGuildSettings(
  guildId: number,
  updates: Partial<Pick<GuildSettingsUpdate, "prefix" | "locale" | "data">>,
): Promise<GuildSettingsRow> {
  const payload: GuildSettingsUpdate = {
    ...updates,
    updated_at: new Date().toISOString(),
    data: updates.data as Json | undefined,
  };

  const { data, error } = await supabase
    .from("guild_settings")
    .update(payload)
    .eq("guild_id", guildId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upsertGuildSettings(
  guildId: number,
  values?: Partial<Pick<GuildSettingsInsert, "prefix" | "locale" | "data">>,
): Promise<GuildSettingsRow> {
  const payload: GuildSettingsInsert = {
    guild_id: guildId,
    prefix: values?.prefix ?? null,
    locale: values?.locale ?? null,
    data: (values?.data ?? {}) as Json,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("guild_settings")
    .upsert(payload, { onConflict: "guild_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
