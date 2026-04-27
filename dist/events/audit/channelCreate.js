import { AuditLogEvent, ChannelType, EmbedBuilder, Events, } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
function getChannelTypeLabel(type) {
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
    name: Events.ChannelCreate,
    async execute(channel) {
        const client = channel.client;
        const embed = new EmbedBuilder()
            .setTitle("Canal criado")
            .setDescription(`O canal ${channel} foi criado.`)
            .setColor(auditColors.channelCreate)
            .setTimestamp(new Date())
            .addFields({
            name: "Canal",
            value: `${channel.name}\n\`${channel.id}\``,
            inline: true,
        }, {
            name: "Tipo",
            value: getChannelTypeLabel(channel.type),
            inline: true,
        }, {
            name: "Categoria",
            value: channel.parent
                ? `${channel.parent.name}\n\`${channel.parentId}\``
                : "Nenhuma",
            inline: true,
        });
        await client.auditService.send(embed, {
            guild: channel.guild,
            type: AuditLogEvent.ChannelCreate,
            targetId: channel.id,
        });
    },
};
//# sourceMappingURL=channelCreate.js.map