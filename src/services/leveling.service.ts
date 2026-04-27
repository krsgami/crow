import { supabase } from "../structures/Supabase.structure.js";
import { ensureUserContextById } from "./context.service.js";

export interface AddUserExpResult {
  leveledUp: boolean;
  levelsGained: number;
  current: {
    level: number;
    exp: number;
    level_up_exp: number;
  };
}

function getLevelUpExp(level: number): number {
  return Math.round(level * 2.25);
}

export async function addUserExp(
  discordUserId: string,
  expAmount: number,
): Promise<AddUserExpResult> {
  const { user, stats: currentStats } =
    await ensureUserContextById(discordUserId);

  let level = 0;
  let exp = 0;
  let level_up_exp = 5;

  if (currentStats) {
    level = currentStats.level;
    exp = currentStats.exp;
    level_up_exp = currentStats.level_up_exp;
  } else {
    const { error: insertError } = await supabase.from("user_stats").insert({
      user_id: user.id,
      level: 0,
      exp: 0,
      level_up_exp: 5,
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      throw new Error(`Failed to create user stats: ${insertError.message}`);
    }
  }

  let newExp = exp + expAmount;
  let levelsGained = 0;

  while (newExp >= level_up_exp) {
    newExp -= level_up_exp;
    level += 1;
    levelsGained += 1;

    level_up_exp = getLevelUpExp(level_up_exp);
  }

  const { error } = await supabase
    .from("user_stats")
    .upsert({
      user_id: user.id,
      level,
      exp: newExp,
      level_up_exp,
      updated_at: new Date().toISOString(),
    })
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update stats: ${error.message}`);
  }

  return {
    leveledUp: levelsGained > 0,
    levelsGained,
    current: {
      level,
      exp: newExp,
      level_up_exp,
    },
  };
}
