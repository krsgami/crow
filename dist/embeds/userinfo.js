import { EmbedBuilder, } from "discord.js";
import { Guild } from "../utils/Guild.util.js";
import { ensureUserContext } from "../services/context.service.js";
export async function UserInfoEmbed(targetUser, targetMember, executor, command, client) {
    const { stats } = await ensureUserContext(targetUser);
    function getJoinPositionFromCache(member) {
        const sorted = [...member.guild.members.cache.values()]
            .filter((m) => m.joinedTimestamp != null)
            .sort((a, b) => (a.joinedTimestamp ?? 0) - (b.joinedTimestamp ?? 0));
        const index = sorted.findIndex((m) => m.id === member.id);
        return index === -1 ? null : index + 1;
    }
    const joinPosition = targetMember
        ? getJoinPositionFromCache(targetMember)
        : null;
    const targetFlags = targetUser.flags;
    const badges = targetFlags?.toArray() ?? [];
    const badgeEmojis = {
        HypeSquadOnlineHouse1: Guild.emojis.hs_bravery,
        HypeSquadOnlineHouse2: Guild.emojis.hs_brilliance,
        HypeSquadOnlineHouse3: Guild.emojis.hs_balance,
        Hypesquad: Guild.emojis.hypesquad_badge,
    };
    const badgeList = badges
        .map((badge) => badgeEmojis[badge])
        .filter((value) => Boolean(value));
    const hasNitro = targetUser.avatarURL({ size: 1024 })?.includes("animated=true") ||
        targetMember?.avatarURL({ size: 1024 })?.includes("animated=true") ||
        Boolean(targetUser.banner) ||
        Boolean(targetMember?.banner);
    if (hasNitro) {
        badgeList.push(Guild.emojis.nitro_badge);
    }
    const rawStatus = (targetMember?.presence?.status ??
        "offline");
    const statusEmojis = {
        online: Guild.emojis.online_status,
        idle: Guild.emojis.idle_status,
        dnd: Guild.emojis.dnd_status,
        offline: Guild.emojis.off_status,
        invisible: Guild.emojis.off_status,
    };
    const statusTrad = {
        online: "Online",
        idle: "Ausente",
        dnd: "Não perturbe",
        offline: "Offline",
        invisible: "Offline",
    };
    const statusEmoji = statusEmojis[rawStatus] ?? Guild.emojis.off_status;
    const activity = targetMember?.presence?.activities?.[0];
    const activityTypes = {
        0: "Jogando",
        1: "Ao vivo",
        2: "Ouvindo",
        3: "Assistindo",
        4: "",
        5: "Competindo",
    };
    const activityType = activity ? activityTypes[activity.type] : "";
    const activityName = activity?.name ?? "";
    const activityText = activity ? `| ${activityType} \`${activityName}\`` : "";
    const rolesText = targetMember
        ? (() => {
            const roles = targetMember.roles.cache
                .filter((role) => role.name !== "@everyone")
                .map((role) => role.toString());
            if (!roles.length)
                return "Nenhum";
            const joined = roles.slice(0, 10).join(", ");
            return roles.length > 10 ? `${joined} + e mais` : joined;
        })()
        : "Nenhum";
    const embed = new EmbedBuilder()
        .setAuthor({
        name: executor.username,
        iconURL: executor.displayAvatarURL({ size: 1024 }),
    })
        .setThumbnail(targetMember?.displayAvatarURL({ size: 1024 }) ??
        targetUser.displayAvatarURL({ size: 1024 }))
        .setTitle(`Informações de ${targetMember?.nickname ??
        targetMember?.displayName ??
        targetUser.username}`)
        .setDescription(`${statusEmoji} ${statusTrad[rawStatus]} ${activityText}`.trim())
        .addFields({
        name: "Usuário",
        value: `\`@${targetUser.username}\``,
        inline: true,
    }, {
        name: "Menção",
        value: `${targetUser}`,
        inline: true,
    }, {
        name: "ID",
        value: `\`${targetUser.id}\``,
        inline: true,
    }, {
        name: "Criado",
        value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
        inline: true,
    }, {
        name: "Posição de entrada",
        value: joinPosition ? `#${joinPosition}` : "-",
        inline: true,
    }, {
        name: "Entrou",
        value: targetMember?.joinedTimestamp != null
            ? `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>`
            : "-",
        inline: true,
    }, {
        name: "Distintivos",
        value: badgeList.length ? badgeList.join(" ") : "Nenhum",
        inline: false,
    }, {
        name: "Cargos",
        value: rolesText,
        inline: false,
    })
        .setColor(targetUser.accentColor ?? "Orange")
        .setFooter({
        text: `${client.user?.username ?? "App"} - ${command.name}`,
        iconURL: client.user?.displayAvatarURL({ size: 1024 }),
    })
        .setTimestamp();
    if (stats) {
        embed.addFields({
            name: "Nível",
            value: `\`Nível ${stats.level}\``,
            inline: true,
        }, {
            name: "\u200b",
            value: "\u200b",
            inline: true,
        }, {
            name: "XP",
            value: `\`${stats.exp}/${stats.level_up_exp} xp\``,
            inline: true,
        });
    }
    const bannerUrl = targetMember?.bannerURL({ size: 1024 }) ??
        targetUser.bannerURL({ size: 1024 }) ??
        null;
    if (bannerUrl) {
        embed.setImage(bannerUrl);
    }
    return embed;
}
//# sourceMappingURL=userinfo.js.map