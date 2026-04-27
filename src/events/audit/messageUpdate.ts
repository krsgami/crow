import {
  AuditLogEvent,
  EmbedBuilder,
  Events,
  type APIEmbedField,
  type Message,
  type PartialMessage,
} from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";
import { Guild } from "../../utils/Guild.util.js";
import { truncate } from "../../functions/text.function.js";

async function getAttachmentSummary(
  message: Message | PartialMessage,
): Promise<string> {
  if (!message.attachments?.size) return "Nenhum";

  return await truncate(
    message.attachments
      .map((attachment) => attachment.name ?? attachment.url)
      .join("\n"),
    1024,
  );
}

export default {
  name: Events.MessageUpdate,
  async execute(
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage,
  ) {
    const client = newMessage.client as CrowClient;

    if (!newMessage.inGuild()) return;
    if (newMessage.author?.bot) return;
    if (newMessage.channelId === Guild.channels.logs) return;

    const oldContent = oldMessage.partial ? null : (oldMessage.content ?? "");

    const newContent = newMessage.partial ? null : (newMessage.content ?? "");

    const fields: APIEmbedField[] = [];

    if (
      oldContent !== null &&
      newContent !== null &&
      oldContent !== newContent
    ) {
      fields.push({
        name: "Antes",
        value: await truncate(oldContent || "Nenhum conteúdo"),
        inline: false,
      });

      fields.push({
        name: "Depois",
        value: await truncate(newContent || "Nenhum conteúdo"),
        inline: false,
      });
    }

    const oldAttachments = oldMessage.partial
      ? null
      : getAttachmentSummary(oldMessage);

    const newAttachments = newMessage.partial
      ? null
      : getAttachmentSummary(newMessage);

    if (
      oldAttachments !== null &&
      newAttachments !== null &&
      oldAttachments !== newAttachments
    ) {
      fields.push({
        name: "Anexos antes",
        value: await oldAttachments,
        inline: false,
      });

      fields.push({
        name: "Anexos depois",
        value: await newAttachments,
        inline: false,
      });
    }

    if (!fields.length) return;

    const embed = new EmbedBuilder()
      .setTitle("Mensagem atualizada")
      .setDescription(`Uma mensagem foi editada em ${newMessage.channel}.`)
      .setColor(auditColors.messageUpdate)
      .setTimestamp(new Date())
      .addFields(
        {
          name: "Autor",
          value: newMessage.author
            ? `${newMessage.author}\n\`${newMessage.author.id}\``
            : "Autor desconhecido",
          inline: true,
        },
        {
          name: "Canal",
          value: `${newMessage.channel}\n\`${newMessage.channel.id}\``,
          inline: true,
        },
        {
          name: "Mensagem",
          value: `[\`Ir para mensagem\`](${newMessage.url})`,
          inline: true,
        },
        ...fields,
      );

    if (newMessage.author) {
      embed.setThumbnail(newMessage.author.displayAvatarURL());
    }

    await client.auditService.send(embed, {
      guild: newMessage.guild,
      type: "MessageUpdate",
      targetId: newMessage.id,
    });
  },
};
