import { supabase } from "../structures/Supabase.structure.js";
import type { Json } from "../types/Database.js";

export type FavoriteCategory = "football_team" | "esports_team";

export type FavoriteInput = {
  discordId: string;
  category: FavoriteCategory;
  externalId: string;
  name: string;
  shortName?: string | null;
  code?: string | null;
  imageUrl?: string | null;
  source?: string | null;
  metadata?: Json;
};

async function getDatabaseUserByDiscordId(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, discord_user_id")
    .eq("discord_user_id", userId)
    .single();

  if (error) throw error;

  return data;
}

export async function upsertUserFavorite(input: FavoriteInput) {
  const dbUser = await getDatabaseUserByDiscordId(input.discordId);

  const { data, error } = await supabase
    .from("user_favorites")
    .upsert(
      {
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
      },
      {
        onConflict: "user_id,category",
      },
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getUserFavorite(
  discordId: string,
  category: FavoriteCategory,
) {
  const dbUser = await getDatabaseUserByDiscordId(discordId);

  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", dbUser.id)
    .eq("category", category)
    .maybeSingle();

  if (error) throw error;

  return data;
}
