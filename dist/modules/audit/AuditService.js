import { resolveAuditExecutor } from "./resolveAuditExecutor.js";
export class AuditService {
    constructor(client, channelId) {
        this.client = client;
        this.channelId = channelId;
    }
    async send(embed, context) {
        const channel = await this.client.channels
            .fetch(this.channelId)
            .catch(() => null);
        if (!channel || !channel.isSendable() || channel.isDMBased())
            return;
        if (context?.guild && context.type) {
            const audit = await resolveAuditExecutor(context.guild, {
                type: context.type,
                targetId: context.targetId,
            });
            if (audit?.executor) {
                embed.addFields({
                    name: "Executado por",
                    value: `${audit.executor} - \`${audit.executor.id}\``,
                    inline: false,
                });
            }
            if (audit?.reason) {
                embed.addFields({
                    name: "Motivo",
                    value: audit.reason,
                    inline: false,
                });
            }
            embed.setFooter({ text: `Auditoria • ${audit?.type ?? "Desconhecido"}` });
        }
        await channel.send({ embeds: [embed] }).catch(() => null);
    }
}
//# sourceMappingURL=AuditService.js.map