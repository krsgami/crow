import { Events, ChannelType } from "discord.js";
export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        for (const guild of client.guilds.cache.values()) {
            const channels = await guild.channels.fetch();
            for (const channel of channels.values()) {
                if (!channel || !channel.isTextBased())
                    continue;
                if (channel.type !== ChannelType.GuildText)
                    continue;
                await channel.messages.fetch({ limit: 100 }).catch(() => null);
            }
        }
        client.logger.success(`Pré-cache de mensagens concluído.`);
    },
};
//# sourceMappingURL=messageCache.js.map