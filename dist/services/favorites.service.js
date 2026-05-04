import { supabase } from "../structures/Supabase.structure.js";
async function getDatabaseUserByDiscordId(userId) {
    const { data, error } = await supabase
        .from("users")
        .select("id, discord_user_id")
        .eq("discord_user_id", userId)
        .single();
    if (error)
        throw error;
    return data;
}
export async function upsertUserFavorite(input) {
    const dbUser = await getDatabaseUserByDiscordId(input.discordId);
    const { data, error } = await supabase
        .from("user_favorites")
        .upsert({
        user_id: dbUser.id,
        category: input.category,
        external_id: input.externalId,
        name: input.name,
        short_name: input.shortName ?? null,
        code: input.code ?? null,
        image_url: input.imageUrl ?? null,
        source: input.source ?? null,
        metadata: input.metadata ?? {},
        updated_at: new Date().toISOString(),
    }, {
        onConflict: "user_id,category",
    })
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function getUserFavorite(discordId, category) {
    const dbUser = await getDatabaseUserByDiscordId(discordId);
    const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", dbUser.id)
        .eq("category", category)
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
//# sourceMappingURL=favorites.service.js.map