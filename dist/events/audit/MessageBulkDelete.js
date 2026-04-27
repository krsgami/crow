import { AuditLogEvent, EmbedBuilder, Events, } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import { Guild } from "../../utils/Guild.util.js";
import { truncate } from "../../functions/text.function.js";
async function buildMessagePreview(messages) {
    const preview = messages
        .first(10)
        .map((message) => {
        const author = message.author?.tag ?? "Autor desconhecido";
        const content = message.content?.trim() || "[sem conteúdo]";
        return `- ${author}: ${content}`;
    })
        .join("\n");
    return await truncate(preview || "Nenhuma mensagem disponível.", 1024);
}
async function buildAuthorsSummary(messages) {
    const uniqueAuthors = [
        ...new Map(messages
            .filter((message) => message.author)
            .map((message) => [message.author.id, message.author.tag])).values(),
    ];
    const summary = uniqueAuthors.slice(0, 20).join("\n");
    return await truncate(summary || "Autores desconhecidos", 1024);
}
export default {
    name: Events.MessageBulkDelete,
    async execute(messages) {
        const firstMessage = messages.first();
        if (!firstMessage)
            return;
        const client = firstMessage.client;
        if (!firstMessage.inGuild())
            return;
        if (firstMessage.channelId === Guild.channels.logs)
            return;
        const humanMessages = messages.filter((message) => !message.author?.bot);
        if (!humanMessages.size)
            return;
        const channel = firstMessage.channel;
        const fields = [];
        fields.push({
            name: "Quantidade",
            value: `\`${humanMessages.size}\` mensagens`,
            inline: true,
        });
        fields.push({
            name: "Canal",
            value: `${channel}\n\`${channel.id}\``,
            inline: true,
        });
        fields.push({
            name: "Autores afetados",
            value: await buildAuthorsSummary(humanMessages),
            inline: false,
        });
        fields.push({
            name: "Prévia",
            value: await buildMessagePreview(humanMessages),
            inline: false,
        });
        const embed = new EmbedBuilder()
            .setTitle("Mensagens apagadas em massa")
            .setDescription(`Várias mensagens foram apagadas em ${channel}.`)
            .setColor(auditColors.messageBulkDelete)
            .setTimestamp(new Date())
            .addFields(fields);
        await client.auditService.send(embed, {
            guild: firstMessage.guild,
            type: AuditLogEvent.MessageBulkDelete,
        });
    },
};
//# sourceMappingURL=MessageBulkDelete.js.map