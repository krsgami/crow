import { EmbedBuilder, MessageFlags, SlashCommandBuilder, } from "discord.js";
import { Guild } from "../../utils/Guild.js";
import { SlashCommand } from "../../structures/SlashCommand.js";
export default class ServerInfoCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName("serverinfo")
            .setDescription("Mostra informações sobre o servidor atual"));
    }
    async execute(interaction) {
        const { client, guild, user } = interaction;
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
        const rulesChannel = await guild?.channels.fetch(Guild.channels.rules);
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
        const embed = new EmbedBuilder()
            .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ size: 64 }),
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
        }, { name: "Membros", value: `${memberCount} membros`, inline: true }, {
            name: "Membro Mais Recente",
            value: `${newestMember?.user || "Membro desconhecido"}`,
            inline: true,
        }, { name: "Cargos", value: `${rolesCount} cargos`, inline: true }, {
            name: "Cargo mais alto",
            value: `${guild?.roles.highest}`,
            inline: true,
        }, {
            name: "Cargo Mais Comum",
            value: `${mostCommonRole || "Nenhum"}`,
            inline: true,
        }, { name: "Nível de impulso", value: `${guild?.premiumTier}`, inline: true }, {
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
        }, {
            name: "Criado",
            value: `<t:${createdAt}:R>`,
            inline: true,
        }, { name: "Canais", value: `${channelsCount}`, inline: true }, {
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
        }, { name: "\u200B", value: "\u200B", inline: true }, { name: "Crow", value: `${client.user}`, inline: true })
            .setURL(Guild.invites.rules)
            .setFooter({
            text: `${client.user?.username} - ${this.data.name}`,
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
        await interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral],
        });
    }
}
//# sourceMappingURL=serverinfo.js.map