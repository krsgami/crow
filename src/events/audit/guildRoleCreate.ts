import {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  type EmbedField,
  type Role,
} from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";
import { getRoleManagedInfo } from "../../functions/role.function.js";

export default {
  name: Events.GuildRoleCreate,
  async execute(role: Role) {
    const client = role.client as CrowClient;

    const fields: EmbedField[] = [];

    const embed = new EmbedBuilder()
      .setTitle("Cargo criado")
      .setDescription(`O cargo ${role} foi criado.`)
      .setColor(auditColors.roleCreate)
      .setTimestamp(new Date());

    if (role.unicodeEmoji) {
      fields.push({
        name: "Emoji",
        value: role.unicodeEmoji,
        inline: true,
      });
    }

    fields.push(
      {
        name: "Destacado",
        value: role.hoist ? "Sim" : "Não",
        inline: true,
      },
      {
        name: "Mencionável",
        value: role.mentionable ? "Sim" : "Não",
        inline: true,
      },
      {
        name: "Cor",
        value: `\`${role.hexColor}\``,
        inline: true,
      },
      {
        name: "Gerenciado",
        value: await getRoleManagedInfo(role),
        inline: true,
      },
    );

    if (role.icon) {
      embed.setThumbnail(role.iconURL({ size: 128 }));
    }

    if (!fields.length) return;

    await client.auditService.send(embed, {
      guild: role.guild,
      type: AuditLogEvent.RoleCreate,
      targetId: role.id,
    });
  },
};
