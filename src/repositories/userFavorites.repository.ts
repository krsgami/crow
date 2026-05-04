import { supabase } from "../structures/Supabase.structure.js";
import type { Database } from "../types/Database.js";

type UserFavoritesRow = Database["public"]["Tables"]["user_favorites"]["Row"];
type UserFavoritesInsert =
  Database["public"]["Tables"]["user_favorites"]["Insert"];
type UserFavoritesUpdate =
  Database["public"]["Tables"]["user_favorites"]["Update"];

export type FavoriteCategory = "football_team" | "esports_team";

export async function getUserFavoriteByUserId(
  userId: number,
  category: FavoriteCategory,
): Promise<UserFavoritesRow | null> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserFavoritesByUserId(
  userId: number,
): Promise<UserFavoritesRow[]> {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

type CreateUserFavoriteInput = {
  userId: number;
  category: FavoriteCategory;
  externalId: string;
  name: string;
  shortName?: string | null;
  code?: string | null;
  imageUrl?: string | null;
  source?: string | null;
  metadata?: UserFavoritesInsert["metadata"];
};

export async function createUserFavorite(
  input: CreateUserFavoriteInput,
): Promise<UserFavoritesRow> {
  const payload: UserFavoritesInsert = {
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

  if (error) throw error;
  return data;
}

export async function updateUserFavorite(
  userId: number,
  category: FavoriteCategory,
  updates: UserFavoritesUpdate,
): Promise<UserFavoritesRow> {
  const payload: UserFavoritesUpdate = {
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

  if (error) throw error;
  return data;
}

export async function deleteUserFavorite(
  userId: number,
  category: FavoriteCategory,
): Promise<void> {
  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("category", category);

  if (error) throw error;
}
