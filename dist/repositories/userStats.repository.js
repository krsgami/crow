import { supabase } from "../structures/supabase.js";
export async function getUserStatsByUserId(userId) {
    const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
export async function createUserStats(userId) {
    const payload = { user_id: userId };
    const { data, error } = await supabase
        .from("user_stats")
        .insert(payload)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateUserStats(userId, updates) {
    const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
        .from("user_stats")
        .update(payload)
        .eq("user_id", userId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
//# sourceMappingURL=userStats.repository.js.map