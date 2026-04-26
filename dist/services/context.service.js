import { getUserByDiscordId, createUser, upsertUser, } from "../repositories/user.repository.js";
import { createUserStats, getUserStatsByUserId, } from "../repositories/userStats.repository.js";
import { createGuild, getGuildByDiscordId, upsertGuild, } from "../repositories/guilds.repository.js";
import { createGuildSettings, getGuildSettings, } from "../repositories/guildSettings.repository.js";
import { createGuildMember, getGuildMember, } from "../repositories/guildMembers.repository.js";
import { supabase } from "../structures/supabase.js";
export async function getOrCreateUser(discordUser) {
    let user = await getUserByDiscordId(discordUser.id);
    if (!user) {
        user = await createUser(discordUser.id, discordUser.username);
    }
    else if (user.username !== discordUser.username) {
        user = await upsertUser(discordUser.id, discordUser.username);
    }
    return user;
}
export async function getOrCreateUserStats(userId) {
    let stats = await getUserStatsByUserId(userId);
    if (!stats) {
        stats = await createUserStats(userId);
    }
    return stats;
}
export async function getOrCreateGuild(discordGuild) {
    let guild = await getGuildByDiscordId(discordGuild.id);
    if (!guild) {
        guild = await createGuild(discordGuild.id, discordGuild.name);
    }
    else if (guild.name !== discordGuild.name) {
        guild = await upsertGuild(discordGuild.id, discordGuild.name);
    }
    return guild;
}
export async function getOrCreateGuildSettings(guildId) {
    let settings = await getGuildSettings(guildId);
    if (!settings) {
        settings = await createGuildSettings(guildId);
    }
    return settings;
}
export async function getOrCreateGuildMember(guildId, userId) {
    let member = await getGuildMember(guildId, userId);
    if (!member) {
        member = await createGuildMember(guildId, userId);
    }
    return member;
}
export async function ensureUserContext(discordUser) {
    const user = await getOrCreateUser(discordUser);
    const stats = await getOrCreateUserStats(user.id);
    return { user, stats };
}
export async function ensureUserContextById(discordUserId) {
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("discord_user_id", discordUserId)
        .maybeSingle();
    if (userError)
        throw userError;
    if (!userData) {
        // Create user if missing
        const { data: newUser, error } = await supabase
            .from("users")
            .insert({
            discord_user_id: discordUserId,
            username: "Unknown", // Will be updated later if needed
            is_bot: false,
        })
            .select()
            .single();
        if (error)
            throw error;
        return { user: newUser, stats: null };
    }
    const { data: statsData, error: statsError } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userData.id)
        .maybeSingle();
    if (statsError)
        throw statsError;
    if (!statsData) {
        // Create stats if missing
        const { data: newStats, error } = await supabase
            .from("user_stats")
            .insert({
            user_id: userData.id,
            level: 1,
            exp: 0,
            level_up_exp: 5, // 5 * 1^2
        })
            .select()
            .single();
        if (error)
            throw error;
        return { user: userData, stats: newStats };
    }
    return { user: userData, stats: statsData };
}
export async function ensureGuildContext(discordGuild) {
    const guild = await getOrCreateGuild(discordGuild);
    if (guild) {
        const settings = await getOrCreateGuildSettings(guild.id);
        return { guild, settings };
    }
    else
        return null;
}
export async function ensureMemberContext(discordGuild, discordUser) {
    const { user, stats } = await ensureUserContext(discordUser);
    const guildContext = await ensureGuildContext(discordGuild);
    if (!guildContext?.guild) {
        return null;
    }
    const { guild, settings } = guildContext;
    const member = await getOrCreateGuildMember(guild.id, user.id);
    return {
        user,
        stats,
        guild,
        settings,
        member,
    };
}
//# sourceMappingURL=context.service.js.map