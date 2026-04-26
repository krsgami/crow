import { supabase } from "../structures/supabase.js";
export async function getGuildByDiscordId(discordGuildId) {
    const { data, error } = await supabase
        .from("guilds")
        .select("*")
        .eq("discord_guild_id", discordGuildId)
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
export async function createGuild(discordGuildId, name) {
    const { data, error } = await supabase
        .from("guilds")
        .insert({
        discord_guild_id: discordGuildId,
        name,
    })
        .select()
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
export async function upsertGuild(discordGuildId, name) {
    const { data, error } = await supabase
        .from("guilds")
        .upsert({
        discord_guild_id: discordGuildId,
        name,
        updated_at: new Date().toISOString(),
    }, { onConflict: "discord_guild_id" })
        .select()
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
//# sourceMappingURL=guilds.repository.js.map