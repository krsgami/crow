import { supabase } from "../structures/Supabase.structure.js";
export async function getUserFavoriteByUserId(userId, category) {
    const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", userId)
        .eq("category", category)
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
export async function getUserFavoritesByUserId(userId) {
    const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
    if (error)
        throw error;
    return data ?? [];
}
export async function createUserFavorite(input) {
    const payload = {
        user_id: input.userId,
        category: input.category,
        external_id: input.externalId,
        name: input.name,
        short_name: input.shortName ?? null,
        code: input.code ?? null,
        image_url: input.imageUrl ?? null,
        source: input.source ?? null,
        metadata: input.metadata ?? {},
    };
    const { data, error } = await supabase
        .from("user_favorites")
        .upsert(payload, {
        onConflict: "user_id,category",
    })
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateUserFavorite(userId, category, updates) {
    const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
        .from("user_favorites")
        .update(payload)
        .eq("user_id", userId)
        .eq("category", category)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function deleteUserFavorite(userId, category) {
    const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("category", category);
    if (error)
        throw error;
}
//# sourceMappingURL=userFavorites.repository.js.map