import {
  AuditLogEvent,
  ChannelType,
  EmbedBuilder,
  Events,
  type GuildChannel,
} from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";

function getChannelTypeLabel(type: ChannelType): string {
  switch (type) {
    case ChannelType.GuildText:
      return "Texto";
    case ChannelType.GuildVoice:
      return "Voz";
    case ChannelType.GuildCategory:
      return "Categoria";
    case ChannelType.GuildAnnouncement:
      return "Anúncios";
    case ChannelType.GuildForum:
      return "Fórum";
    case ChannelType.GuildStageVoice:
      return "Palco";
    default:
      return "Outro";
  }
}

export default {
  name: Events.ChannelDelete,
  async execute(channel: GuildChannel) {
    const client = channel.client as CrowClient;

    const embed = new EmbedBuilder()
      .setTitle("Canal removido")
      .setDescription(`O canal **${channel.name}** foi removido.`)
      .setColor(auditColors.channelDelete)
      .setTimestamp(new Date())
      .addFields(
        {
          name: "Canal",
          value: `${channel.name}\n\`${channel.id}\``,
          inline: true,
        },
        {
          name: "Tipo",
          value: getChannelTypeLabel(channel.type),
          inline: true,
        },
        {
          name: "Categoria",
          value: channel.parent
            ? `${channel.parent.name}\n\`${channel.parentId}\``
            : "Nenhuma",
          inline: true,
        },
      );

    await client.auditService.send(embed, {
      guild: channel.guild,
      type: AuditLogEvent.ChannelDelete,
      targetId: channel.id,
    });
  },
};
