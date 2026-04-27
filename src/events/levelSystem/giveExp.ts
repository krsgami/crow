import { Events, type Message } from "discord.js";
import { Logger } from "../../utils/Logger.util.js";
import { Guild } from "../../utils/Guild.util.js";
import { addUserExp } from "../../services/leveling.service.js";
import { levelUpEmbed } from "../../embeds/levelUp.js";
import { ensureUserContext } from "../../services/context.service.js";

const XP_COOLDOWN_MS = 10_000;
const xpCooldowns = new Map<string, number>();

function getCooldownKey(guildId: string, userId: string): string {
  return `${guildId}:${userId}`;
}

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    const { author, channel, guild } = message;

    try {
      if (author.bot) return;
      if (!guild) return;

      const cooldownKey = getCooldownKey(guild.id, author.id);
      const now = Date.now();
      const lastEarnedAt = xpCooldowns.get(cooldownKey);

      if (lastEarnedAt && now - lastEarnedAt < XP_COOLDOWN_MS) {
        return;
      }

      const randomExp = Math.floor(Math.random() * 10) + 1;

      let exp = randomExp;

      if (guild.id === Guild.ID) {
        exp += 5;
      }

      const oldLevel = (await ensureUserContext(author)).stats.level;
      const result = await addUserExp(author.id, exp);

      xpCooldowns.set(cooldownKey, now);

      if (result.leveledUp && channel.isSendable()) {
        const embed = await levelUpEmbed(
          author,
          oldLevel,
          result.current.level,
          result.current.level - oldLevel,
          result.current.exp,
          result.current.level_up_exp,
          exp,
          guild,
        );
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      Logger.error(error, "Falha ao processar XP da mensagem");
    }
  },
};
