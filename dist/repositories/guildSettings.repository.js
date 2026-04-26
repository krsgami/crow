import { supabase } from "../structures/supabase.js";
export async function getGuildSettings(guildId) {
    const { data, error } = await supabase
        .from("guild_settings")
        .select("*")
        .eq("guild_id", guildId)
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
export async function createGuildSettings(guildId, values) {
    const payload = {
        guild_id: guildId,
        prefix: values?.prefix ?? null,
        locale: values?.locale ?? null,
        data: (values?.data ?? {}),
    };
    const { data, error } = await supabase
        .from("guild_settings")
        .insert(payload)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateGuildSettings(guildId, updates) {
    const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
        data: updates.data,
    };
    const { data, error } = await supabase
        .from("guild_settings")
        .update(payload)
        .eq("guild_id", guildId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function upsertGuildSettings(guildId, values) {
    const payload = {
        guild_id: guildId,
        prefix: values?.prefix ?? null,
        locale: values?.locale ?? null,
        data: (values?.data ?? {}),
        updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
        .from("guild_settings")
        .upsert(payload, { onConflict: "guild_id" })
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
//# sourceMappingURL=guildSettings.repository.js.map