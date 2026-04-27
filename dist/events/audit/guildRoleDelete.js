import { AuditLogEvent, EmbedBuilder, Events, } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import { getRoleManagedInfo } from "../../functions/role.function.js";
export default {
    name: Events.GuildRoleDelete,
    async execute(role) {
        const client = role.client;
        const fields = [];
        const embed = new EmbedBuilder()
            .setTitle("Cargo apagado")
            .setDescription(`O cargo \`@${role.name}\` foi apagado.`)
            .setColor(auditColors.roleDelete)
            .setTimestamp(new Date());
        if (role.unicodeEmoji) {
            fields.push({
                name: "Emoji",
                value: role.unicodeEmoji,
                inline: true,
            });
        }
        fields.push({
            name: "Destacado",
            value: role.hoist ? "Sim" : "Não",
            inline: true,
        }, {
            name: "Mencionável",
            value: role.mentionable ? "Sim" : "Não",
            inline: true,
        }, {
            name: "Cor",
            value: `\`${role.hexColor}\``,
            inline: true,
        }, {
            name: "Gerenciado",
            value: await getRoleManagedInfo(role),
            inline: true,
        });
        if (role.icon) {
            embed.setThumbnail(role.iconURL({ size: 128 }));
        }
        if (!fields.length)
            return;
        await client.auditService.send(embed, {
            guild: role.guild,
            type: AuditLogEvent.RoleDelete,
            targetId: role.id,
        });
    },
};
//# sourceMappingURL=guildRoleDelete.js.map