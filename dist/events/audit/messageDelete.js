import { AuditLogEvent, EmbedBuilder, Events, } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import { Guild } from "../../utils/Guild.util.js";
import { truncate } from "../../functions/text.function.js";
async function getAttachmentSummary(message) {
    if (!message.attachments?.size)
        return "Nenhum";
    return await truncate(message.attachments
        .map((attachment) => attachment.name ?? attachment.url)
        .join("\n"), 1024);
}
export default {
    name: Events.MessageDelete,
    async execute(message) {
        const client = message.client;
        if (!message.inGuild())
            return;
        if (message.author?.bot)
            return;
        if (message.channelId === Guild.channels.logs)
            return;
        const content = message.partial ? null : (message.content ?? "");
        const fields = [];
        if (content !== null) {
            fields.push({
                name: "Conteúdo",
                value: await truncate(content || "Nenhum conteúdo"),
                inline: false,
            });
        }
        const attachments = message.partial ? null : getAttachmentSummary(message);
        if (attachments !== null) {
            fields.push({
                name: "Anexos",
                value: await attachments,
                inline: false,
            });
        }
        if (!fields.length)
            return;
        const embed = new EmbedBuilder()
            .setTitle("Mensagem apagada")
            .setDescription(`Uma mensagem foi apagada em ${message.channel}.`)
            .setColor(auditColors.messageDelete)
            .setTimestamp(new Date())
            .addFields({
            name: "Autor",
            value: message.author
                ? `${message.author}\n\`${message.author.id}\``
                : "Autor desconhecido",
            inline: true,
        }, {
            name: "Canal",
            value: `${message.channel}\n\`${message.channel.id}\``,
            inline: true,
        }, {
            name: "Mensagem",
            value: `[\`Ir para mensagem\`](${message.url})`,
            inline: true,
        }, ...fields);
        if (message.author) {
            embed.setThumbnail(message.author.displayAvatarURL());
        }
        await client.auditService.send(embed, {
            guild: message.guild,
            type: AuditLogEvent.MessageDelete,
            targetId: message.id,
        });
    },
};
//# sourceMappingURL=messageDelete.js.map