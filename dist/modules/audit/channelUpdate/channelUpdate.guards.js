import { ChannelType } from "discord.js";
export function isTextLikeChannel(channel) {
    return (channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement ||
        channel.type === ChannelType.GuildForum ||
        channel.type === ChannelType.GuildMedia);
}
export function isVoiceLikeChannel(channel) {
    return (channel.type === ChannelType.GuildVoice ||
        channel.type === ChannelType.GuildStageVoice);
}
export function isThreadLikeChannel(channel) {
    return (channel.type === ChannelType.PublicThread ||
        channel.type === ChannelType.PrivateThread ||
        channel.type === ChannelType.AnnouncementThread);
}
export function isCategoryChannel(channel) {
    return channel.type === ChannelType.GuildCategory;
}
//# sourceMappingURL=channelUpdate.guards.js.map