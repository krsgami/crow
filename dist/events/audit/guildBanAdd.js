import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
export default {
    name: Events.GuildBanAdd,
    async execute(ban) {
        const client = ban.guild.client;
        const embed = new EmbedBuilder()
            .setTitle("Usuário banido")
            .setDescription(`${ban.user.tag} foi banido do servidor.`)
            .setColor(auditColors.danger)
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp(new Date())
            .addFields({
            name: "Usuário",
            value: `${ban.user}\n\`${ban.user.id}\``,
            inline: true,
        });
        await client.auditService.send(embed, {
            guild: ban.guild,
            type: AuditLogEvent.MemberBanAdd,
            targetId: ban.user.id,
        });
    },
};
//# sourceMappingURL=guildBanAdd.js.map