import { EmbedBuilder, } from "discord.js";
import { Guild as GuildUtil } from "../../utils/Guild.util.js";
export async function ServerInfoEmbed(guild, executor, command, client) {
    const memberCount = guild?.memberCount ?? 0;
    const owner = await guild?.fetchOwner();
    const createdAt = guild?.createdTimestamp
        ? Math.floor(guild.createdTimestamp / 1000)
        : 0;
    const rolesCount = guild?.roles.cache.size ?? 0;
    const channelsCount = guild?.channels.cache.size ?? 0;
    const mostCommonRole = guild?.roles.cache
        .filter((r) => r.name !== "@everyone")
        .sort((a, b) => b.members.size - a.members.size)
        .first();
    const rulesChannel = await guild?.channels.fetch(GuildUtil.channels.rules);
    const newestMember = guild?.members.cache
        .sort((a, b) => b.joinedTimestamp - a.joinedTimestamp)
        .first();
    const apps = guild?.members.cache.filter((m) => m.user.bot).size ?? 0;
    let verificationLevel = "Desconhecido";
    switch (guild?.verificationLevel) {
        case 0:
            verificationLevel = "Nenhum";
            break;
        case 1:
            verificationLevel = "Baixa";
            break;
        case 2:
            verificationLevel = "Média";
            break;
        case 3:
            verificationLevel = "Alta";
            break;
        case 4:
            verificationLevel = "Muito Alta";
            break;
    }
    const roles = guild.roles.cache
        .filter((role) => role.name !== "@everyone")
        .map((role) => role.toString());
    const rolesText = roles.length > 10
        ? `${roles.slice(0, 10).join(", ")} e mais...`
        : roles.join(", ") || "Nenhum";
    const embed = new EmbedBuilder()
        .setAuthor({
        name: executor.username,
        iconURL: executor.displayAvatarURL({ size: 64 }),
    })
        .setTitle(`Informações de ${guild?.name}`)
        .setColor("Purple")
        .setDescription(guild?.description !== null
        ? `\`${guild?.description}\``
        : "Sem descrição disponível.")
        .addFields({
        name: "Dono",
        value: `${owner?.user || "Membro desconhecido"}`,
        inline: true,
    }, { name: "ID", value: `\`${guild.id}\``, inline: true }, {
        name: "Criado",
        value: `<t:${createdAt}:R>`,
        inline: true,
    }, { name: "Membros", value: `${memberCount} membros`, inline: true }, {
        name: "Membro Mais Recente",
        value: `${newestMember?.user || "Membro desconhecido"}`,
        inline: true,
    }, {
        name: "Nível de impulso",
        value: `${guild?.premiumTier}`,
        inline: true,
    }, { name: "Cargos", value: `${rolesCount} cargos`, inline: true }, {
        name: "Cargo mais alto",
        value: `${guild?.roles.highest}`,
        inline: true,
    }, {
        name: "Cargo Mais Comum",
        value: `${mostCommonRole || "Nenhum"}`,
        inline: true,
    }, {
        name: "Impulsos",
        value: `${guild?.premiumSubscriptionCount || 0}`,
        inline: true,
    }, { name: "Emojis", value: `${guild?.emojis.cache.size}`, inline: true }, {
        name: "Nível de Verificação",
        value: verificationLevel,
        inline: true,
    }, {
        name: "Regras",
        value: `${rulesChannel}`,
        inline: true,
    }, { name: `\u200b`, value: `\u200b`, inline: true }, { name: "Canais", value: `${channelsCount}`, inline: true }, {
        name: "Canais de texto",
        value: `${guild?.channels.cache.filter((c) => c.isTextBased()).size} canais de texto`,
        inline: true,
    }, {
        name: "Canais de voz",
        value: `${guild?.channels.cache.filter((c) => c.isVoiceBased()).size} canais de voz`,
        inline: true,
    }, {
        name: "Apps",
        value: `${apps} apps`,
        inline: true,
    }, {
        name: "Cargos",
        value: rolesText,
        inline: false,
    })
        .setURL(GuildUtil.invites.rules)
        .setFooter({
        text: `${client.user?.username} - ${command.name}`,
        iconURL: client.user.displayAvatarURL({
            size: 64,
        }),
    })
        .setTimestamp();
    if (guild?.iconURL()) {
        embed.setThumbnail(guild.iconURL({ size: 512 }));
    }
    if (guild?.bannerURL()) {
        embed.setImage(guild.bannerURL({ size: 1024 }));
    }
    return embed;
}
//# sourceMappingURL=serverinfo.js.map