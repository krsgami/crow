import { Events } from "discord.js";
import type { CrowClient } from "../../structures/Client.structure.js";
import { supabase } from "../../structures/Supabase.structure.js";
import chalk from "chalk";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: CrowClient) {
    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const fetchedGuild = await guild.fetch();
        const members = fetchedGuild.members.cache;

        const guildRow = {
          discord_guild_id: fetchedGuild.id,
          name: fetchedGuild.name,
          updated_at: new Date().toISOString(),
        };

        const { data: guildData, error: guildError } = await supabase
          .from("guilds")
          .upsert(guildRow, { onConflict: "discord_guild_id" })
          .select()
          .single();

        if (guildError) throw guildError;

        await supabase.from("guild_settings").upsert(
          {
            guild_id: guildData.id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "guild_id" },
        );

        const userRows = members.map((member) => ({
          discord_user_id: member.user.id,
          username: member.user.username,
          updated_at: new Date().toISOString(),
          is_bot: member.user.bot,
        }));

        if (userRows.length > 0) {
          const { data: insertedUsers, error: usersError } = await supabase
            .from("users")
            .upsert(userRows, {
              onConflict: "discord_user_id",
            })
            .select();

          if (usersError) throw usersError;

          const statsRows = insertedUsers
            .filter((user) => !user.is_bot)
            .map((user) => ({
              user_id: user.id,
              updated_at: new Date().toISOString(),
            }));

          if (statsRows.length > 0) {
            const { error: statsError } = await supabase
              .from("user_stats")
              .upsert(statsRows, {
                onConflict: "user_id",
              });

            if (statsError) throw statsError;
          }

          const memberRows = insertedUsers.map((user) => ({
            guild_id: guildData.id,
            user_id: user.id,
          }));

          if (memberRows.length > 0) {
            const { error: guildMembersError } = await supabase
              .from("guild_members")
              .upsert(memberRows, {
                onConflict: "guild_id,user_id",
              });

            if (guildMembersError) throw guildMembersError;
          }
        }

        client.logger.info(
          `${chalk.greenBright("Supabase")} sincronização completa para o servidor ${chalk.magentaBright(fetchedGuild.name)}`,
        );

        await sleep(30000);
      } catch (error) {
        client.logger.error(
          `Falha ao sincronizar o servidor ${guild.id}:\u200b ${error}`,
        );
      }
    }
  },
};
