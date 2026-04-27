import {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  type APIEmbedField,
  type Role,
} from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";
import { getRoleManagedInfo } from "../../functions/role.function.js";

export default {
  name: Events.GuildRoleUpdate,
  async execute(oldRole: Role, newRole: Role) {
    const client = newRole.client as CrowClient;

    const fields: APIEmbedField[] = [];

    if (oldRole.name !== newRole.name) {
      fields.push({
        name: "Nome",
        value: `\`${oldRole.name}\` -> \`${newRole.name}\``,
        inline: false,
      });
    }

    if (oldRole.hexColor !== newRole.hexColor) {
      fields.push({
        name: "Cor",
        value: `\`${oldRole.hexColor}\` -> \`${newRole.hexColor}\``,
        inline: false,
      });
    }

    if (oldRole.hoist !== newRole.hoist) {
      fields.push({
        name: "Exibido separadamente",
        value: `\`${oldRole.hoist ? "Sim" : "Não"}\` -> \`${newRole.hoist ? "Sim" : "Não"}\``,
        inline: true,
      });
    }

    if (oldRole.mentionable !== newRole.mentionable) {
      fields.push({
        name: "Mencionável",
        value: `\`${oldRole.mentionable ? "Sim" : "Não"}\` -> \`${newRole.mentionable ? "Sim" : "Não"}\``,
        inline: true,
      });
    }

    if (oldRole.managed !== newRole.managed) {
      fields.push({
        name: "Gerenciado",
        value: `\`${getRoleManagedInfo(oldRole)}\` -> \`${getRoleManagedInfo(newRole)}\``,
        inline: false,
      });
    }

    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      const addedPermissions = newRole.permissions
        .toArray()
        .filter((permission) => !oldRole.permissions.has(permission));

      const removedPermissions = oldRole.permissions
        .toArray()
        .filter((permission) => !newRole.permissions.has(permission));

      if (addedPermissions.length) {
        fields.push({
          name: "Permissões adicionadas",
          value: addedPermissions
            .map((permission) => `\`${permission}\``)
            .join(", ")
            .slice(0, 1024),
          inline: false,
        });
      }

      if (removedPermissions.length) {
        fields.push({
          name: "Permissões removidas",
          value: removedPermissions
            .map((permission) => `\`${permission}\``)
            .join(", ")
            .slice(0, 1024),
          inline: false,
        });
      }
    }

    if (!fields.length) return;

    const embed = new EmbedBuilder()
      .setTitle("Cargo atualizado")
      .setDescription(`O cargo ${newRole} foi atualizado.`)
      .setColor(auditColors.roleUpdate)
      .setTimestamp(new Date())
      .addFields(
        {
          name: "Cargo",
          value: `${newRole.name}\n\`${newRole.id}\``,
          inline: true,
        },
        {
          name: "Cor atual",
          value: `\`${newRole.hexColor}\``,
          inline: true,
        },
        {
          name: "Membros com o cargo",
          value: `\`${newRole.members.size}\``,
          inline: true,
        },
        ...fields,
      );

    await client.auditService.send(embed, {
      guild: newRole.guild,
      type: AuditLogEvent.RoleUpdate,
      targetId: newRole.id,
    });
  },
};
