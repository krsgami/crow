import { AuditLogEvent, EmbedBuilder, Events, type GuildBan } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";

export default {
  name: Events.GuildBanRemove,
  async execute(ban: GuildBan) {
    const client = ban.guild.client as CrowClient;

    const embed = new EmbedBuilder()
      .setTitle("Usuário desbanido")
      .setDescription(`${ban.user.tag} foi desbanido do servidor.`)
      .setColor(auditColors.success)
      .setThumbnail(ban.user.displayAvatarURL())
      .setTimestamp(new Date())
      .addFields({
        name: "Usuário",
        value: `${ban.user}\n\`${ban.user.id}\``,
        inline: true,
      });

    await client.auditService.send(embed, {
      guild: ban.guild,
      type: AuditLogEvent.MemberBanRemove,
      targetId: ban.user.id,
    });
  },
};
