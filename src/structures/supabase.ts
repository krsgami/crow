import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types.js";
import { Logger } from "../utils/Logger.js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  Logger.error("SUPABASE_URL está faltando");
}

if (!serviceRoleKey) {
  Logger.error("SUPABASE_SERVICE_ROLE_KEY está faltando");
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
