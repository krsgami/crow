import {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  type GuildBasedChannel,
} from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";
import { buildChannelUpdateFields } from "../../modules/audit/channelUpdate/channelUpdate.fields.js";
import {
  formatParent,
  getChannelTypeLabel,
} from "../../modules/audit/channelUpdate/channelUpdate.formatters.js";

export default {
  name: Events.ChannelUpdate,
  async execute(oldChannel: GuildBasedChannel, newChannel: GuildBasedChannel) {
    const client = newChannel.client as CrowClient;
    const fields = await buildChannelUpdateFields(oldChannel, newChannel);

    if (!fields.length) return;

    const embed = new EmbedBuilder()
      .setTitle("Canal atualizado")
      .setDescription(`O canal ${newChannel} foi atualizado.`)
      .setColor(auditColors.channelUpdate)
      .setTimestamp(new Date())
      .addFields(
        {
          name: "Canal",
          value: `${newChannel.name}\n\`${newChannel.id}\``,
          inline: true,
        },
        {
          name: "Tipo atual",
          value: getChannelTypeLabel(newChannel.type),
          inline: true,
        },
        {
          name: "Categoria atual",
          value: formatParent(newChannel),
          inline: true,
        },
        ...fields,
      );

    await client.auditService.send(embed, {
      guild: newChannel.guild,
      type: AuditLogEvent.ChannelUpdate,
      targetId: newChannel.id,
    });
  },
};
