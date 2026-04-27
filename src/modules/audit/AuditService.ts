import { EmbedBuilder, type Client } from "discord.js";
import { resolveAuditExecutor } from "./resolveAuditExecutor.js";
import type { AuditContext } from "../../types/Audit.js";

export class AuditService {
  public constructor(
    private readonly client: Client,
    private readonly channelId: string,
  ) {}

  public async send(
    embed: EmbedBuilder,
    context?: AuditContext,
  ): Promise<void> {
    const channel = await this.client.channels
      .fetch(this.channelId)
      .catch(() => null);
    if (!channel || !channel.isSendable() || channel.isDMBased()) return;

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
