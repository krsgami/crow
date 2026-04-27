import { ChannelType, type GuildBasedChannel } from "discord.js";

export type TextLikeChannel = Extract<
  GuildBasedChannel,
  {
    type:
      | ChannelType.GuildText
      | ChannelType.GuildAnnouncement
      | ChannelType.GuildForum
      | ChannelType.GuildMedia;
  }
>;

export type VoiceLikeChannel = Extract<
  GuildBasedChannel,
  { type: ChannelType.GuildVoice | ChannelType.GuildStageVoice }
>;

export type ThreadLikeChannel = Extract<
  GuildBasedChannel,
  {
    type:
      | ChannelType.PublicThread
      | ChannelType.PrivateThread
      | ChannelType.AnnouncementThread;
  }
>;

export type CategoryLikeChannel = Extract<
  GuildBasedChannel,
  { type: ChannelType.GuildCategory }
>;
