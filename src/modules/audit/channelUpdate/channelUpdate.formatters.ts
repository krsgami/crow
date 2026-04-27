import { ChannelType, type GuildBasedChannel } from "discord.js";

export function formatBoolean(value: boolean): string {
  return value ? "Sim" : "Não";
}

export function formatValue(
  value: string | number | boolean | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "Nenhum";
  if (typeof value === "boolean") return formatBoolean(value);
  return String(value);
}

export function getChannelTypeLabel(type: ChannelType): string {
  switch (type) {
    case ChannelType.GuildText:
      return "Texto";
    case ChannelType.GuildAnnouncement:
      return "Anúncios";
    case ChannelType.GuildVoice:
      return "Voz";
    case ChannelType.GuildStageVoice:
      return "Palco";
    case ChannelType.GuildCategory:
      return "Categoria";
    case ChannelType.GuildForum:
      return "Fórum";
    case ChannelType.GuildMedia:
      return "Mídia";
    case ChannelType.PublicThread:
      return "Thread pública";
    case ChannelType.PrivateThread:
      return "Thread privada";
    case ChannelType.AnnouncementThread:
      return "Thread de anúncio";
    default:
      return "Outro";
  }
}

export function formatParent(channel: GuildBasedChannel): string {
  if (!("parent" in channel) || !channel.parent) return "Nenhuma";
  return `${channel.parent.name}\n\`${channel.parentId}\``;
}
