import { ChannelType, type GuildBasedChannel } from "discord.js";
import type {
  CategoryLikeChannel,
  TextLikeChannel,
  ThreadLikeChannel,
  VoiceLikeChannel,
} from "./channelUpdate.types.js";

export function isTextLikeChannel(
  channel: GuildBasedChannel,
): channel is TextLikeChannel {
  return (
    channel.type === ChannelType.GuildText ||
    channel.type === ChannelType.GuildAnnouncement ||
    channel.type === ChannelType.GuildForum ||
    channel.type === ChannelType.GuildMedia
  );
}

export function isVoiceLikeChannel(
  channel: GuildBasedChannel,
): channel is VoiceLikeChannel {
  return (
    channel.type === ChannelType.GuildVoice ||
    channel.type === ChannelType.GuildStageVoice
  );
}

export function isThreadLikeChannel(
  channel: GuildBasedChannel,
): channel is ThreadLikeChannel {
  return (
    channel.type === ChannelType.PublicThread ||
    channel.type === ChannelType.PrivateThread ||
    channel.type === ChannelType.AnnouncementThread
  );
}

export function isCategoryChannel(
  channel: GuildBasedChannel,
): channel is CategoryLikeChannel {
  return channel.type === ChannelType.GuildCategory;
}
