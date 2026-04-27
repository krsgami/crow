import type { APIEmbedField, GuildBasedChannel } from "discord.js";
import { truncate } from "../../../functions/text.function.js";
import { formatParent, formatValue } from "./channelUpdate.formatters.js";
import {
  isCategoryChannel,
  isTextLikeChannel,
  isThreadLikeChannel,
  isVoiceLikeChannel,
} from "./channelUpdate.guards.js";

function pushFieldIfChanged(
  fields: APIEmbedField[],
  name: string,
  before: string | number | boolean | null | undefined,
  after: string | number | boolean | null | undefined,
  inline = false,
) {
  if (before === after) return;

  fields.push({
    name,
    value: `\`${formatValue(before)}\` -> \`${formatValue(after)}\``,
    inline,
  });
}

export async function buildChannelUpdateFields(
  oldChannel: GuildBasedChannel,
  newChannel: GuildBasedChannel,
): Promise<APIEmbedField[]> {
  const fields: APIEmbedField[] = [];

  pushFieldIfChanged(fields, "Nome", oldChannel.name, newChannel.name);

  if (
    "parentId" in oldChannel &&
    "parentId" in newChannel &&
    oldChannel.parentId !== newChannel.parentId
  ) {
    fields.push({
      name: "Categoria",
      value: `${formatParent(oldChannel)} -> ${formatParent(newChannel)}`,
      inline: false,
    });
  }

  if (isTextLikeChannel(oldChannel) && isTextLikeChannel(newChannel)) {
    if ("nsfw" in oldChannel && "nsfw" in newChannel) {
      pushFieldIfChanged(
        fields,
        "NSFW",
        oldChannel.nsfw,
        newChannel.nsfw,
        true,
      );
    }

    if ("rateLimitPerUser" in oldChannel && "rateLimitPerUser" in newChannel) {
      pushFieldIfChanged(
        fields,
        "Slowmode",
        `${oldChannel.rateLimitPerUser}s`,
        `${newChannel.rateLimitPerUser}s`,
        true,
      );
    }

    if (
      "topic" in oldChannel &&
      "topic" in newChannel &&
      oldChannel.topic !== newChannel.topic
    ) {
      fields.push({
        name: "Tópico",
        value: `${await truncate(oldChannel.topic ?? "Nenhum", 400)} -> ${await truncate(newChannel.topic ?? "Nenhum", 400)}`,
        inline: false,
      });
    }

    if (
      "defaultAutoArchiveDuration" in oldChannel &&
      "defaultAutoArchiveDuration" in newChannel
    ) {
      pushFieldIfChanged(
        fields,
        "Auto arquivamento padrão",
        `${oldChannel.defaultAutoArchiveDuration} min`,
        `${newChannel.defaultAutoArchiveDuration} min`,
        true,
      );
    }

    if (
      "defaultThreadRateLimitPerUser" in oldChannel &&
      "defaultThreadRateLimitPerUser" in newChannel
    ) {
      pushFieldIfChanged(
        fields,
        "Slowmode padrão das threads",
        `${oldChannel.defaultThreadRateLimitPerUser}s`,
        `${newChannel.defaultThreadRateLimitPerUser}s`,
        true,
      );
    }
  }

  if (isVoiceLikeChannel(oldChannel) && isVoiceLikeChannel(newChannel)) {
    pushFieldIfChanged(
      fields,
      "Bitrate",
      oldChannel.bitrate,
      newChannel.bitrate,
      true,
    );
    pushFieldIfChanged(
      fields,
      "Limite de usuários",
      oldChannel.userLimit,
      newChannel.userLimit,
      true,
    );

    if ("rtcRegion" in oldChannel && "rtcRegion" in newChannel) {
      pushFieldIfChanged(
        fields,
        "Região RTC",
        oldChannel.rtcRegion,
        newChannel.rtcRegion,
        true,
      );
    }

    if ("videoQualityMode" in oldChannel && "videoQualityMode" in newChannel) {
      pushFieldIfChanged(
        fields,
        "Qualidade de vídeo",
        oldChannel.videoQualityMode,
        newChannel.videoQualityMode,
        true,
      );
    }
  }

  if (isThreadLikeChannel(oldChannel) && isThreadLikeChannel(newChannel)) {
    pushFieldIfChanged(
      fields,
      "Arquivada",
      oldChannel.archived,
      newChannel.archived,
      true,
    );
    pushFieldIfChanged(
      fields,
      "Bloqueada",
      oldChannel.locked,
      newChannel.locked,
      true,
    );

    if ("invitable" in oldChannel && "invitable" in newChannel) {
      pushFieldIfChanged(
        fields,
        "Invitável",
        oldChannel.invitable,
        newChannel.invitable,
        true,
      );
    }

    pushFieldIfChanged(
      fields,
      "Auto arquivamento",
      `${oldChannel.autoArchiveDuration} min`,
      `${newChannel.autoArchiveDuration} min`,
      true,
    );

    pushFieldIfChanged(
      fields,
      "Slowmode da thread",
      `${oldChannel.rateLimitPerUser}s`,
      `${newChannel.rateLimitPerUser}s`,
      true,
    );
  }

  if (isCategoryChannel(oldChannel) && isCategoryChannel(newChannel)) {
    pushFieldIfChanged(
      fields,
      "Quantidade de canais",
      oldChannel.children.cache.size,
      newChannel.children.cache.size,
      true,
    );
  }

  return fields;
}
