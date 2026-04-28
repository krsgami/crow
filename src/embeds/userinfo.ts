import {
  type GuildMember,
  type User as DJsUser,
  type UserFlagsBitField,
  type PresenceStatus,
  type ActivityType,
  EmbedBuilder,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type ContextMenuCommandBuilder,
  type Client,
} from "discord.js";
import { Guild } from "../utils/Guild.util.js";
import { ensureUserContext } from "../services/context.service.js";
import { getBoostBadge } from "../functions/booster.function.js";

export async function UserInfoEmbed(
  targetUser: DJsUser,
  targetMember: GuildMember | null,
  executor: DJsUser,
  command:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder,
  client: Client,
) {
  const { stats } = await ensureUserContext(targetUser);

  function getJoinPositionFromCache(member: GuildMember): number | null {
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

  const badgeEmojis: Partial<
    Record<keyof typeof UserFlagsBitField.Flags, string>
  > = {
    HypeSquadOnlineHouse1: Guild.emojis.hs_bravery,
    HypeSquadOnlineHouse2: Guild.emojis.hs_brilliance,
    HypeSquadOnlineHouse3: Guild.emojis.hs_balance,
    Hypesquad: Guild.emojis.hypesquad_badge,
  };

  const badgeList = badges
    .map((badge) => badgeEmojis[badge])
    .filter((value): value is string => Boolean(value));

  if (targetMember?.roles.cache.has(Guild.roles.gang_crow)) {
    badgeList.push(":black_bird:");
  }
  const hasAnimatedAvatar =
    targetUser.avatar?.startsWith("a_") ||
    targetMember?.user.avatar?.startsWith("a_") ||
    targetUser.displayAvatarURL({ size: 1024 }).endsWith(".gif");

  const targetMFetch = await targetMember?.fetch();
  const targetUFetch = await targetUser.fetch();

  const banner =
    targetMFetch?.displayBannerURL({ size: 1024 }) ??
    targetUFetch.bannerURL({ size: 1024 });

  const boost = getBoostBadge(targetMFetch);

  const hasBanner =
    (targetMFetch && Boolean(targetMFetch.banner)) ||
    Boolean(targetUFetch?.banner);

  const hasNitro = Boolean(hasAnimatedAvatar || hasBanner);

  if (hasNitro) badgeList.push(Guild.emojis.nitro_badge);

  if (boost.isBooster) badgeList.push(boost.emoji!);

  const rawStatus = ((targetMember?.presence?.status as PresenceStatus) ??
    "offline") as Lowercase<PresenceStatus> | "offline";

  const statusEmojis: Record<Lowercase<PresenceStatus>, string> = {
    online: Guild.emojis.online_status,
    idle: Guild.emojis.idle_status,
    dnd: Guild.emojis.dnd_status,
    offline: Guild.emojis.off_status,
    invisible: Guild.emojis.off_status,
  };

  const statusTrad: Record<Lowercase<PresenceStatus>, string> = {
    online: "Online",
    idle: "Ausente",
    dnd: "Não perturbe",
    offline: "Offline",
    invisible: "Offline",
  };

  const statusEmoji = statusEmojis[rawStatus] ?? Guild.emojis.off_status;

  const activity = targetMember?.presence?.activities?.[0];
  const activityTypes: Record<ActivityType, string> = {
    0: "Jogando",
    1: "Ao vivo",
    2: "Ouvindo",
    3: "Assistindo",
    4: "",
    5: "Competindo",
  };

  const activityType = activity ? activityTypes[activity.type] : "";
  const activityName =
    activity?.type === 4
      ? (activity.state ?? "Custom Status")
      : (activity?.name ?? "");

  const activityText = activity ? `| ${activityType} \`${activityName}\`` : "";

  const rolesText = targetMember
    ? (() => {
        const roles = targetMember.roles.cache
          .filter((role) => role.name !== "@everyone")
          .map((role) => role.toString());

        if (!roles.length) return "Nenhum";

        const joined = roles.slice(0, 10).join(", ");
        return roles.length > 10 ? `${joined} + e mais` : joined;
      })()
    : "Nenhum";

  const embed = new EmbedBuilder()
    .setAuthor({
      name: executor.username,
      iconURL: executor.displayAvatarURL({ size: 1024 }),
    })
    .setThumbnail(
      targetMember?.displayAvatarURL({ size: 1024 }) ??
        targetUser.displayAvatarURL({ size: 1024 }),
    )
    .setTitle(
      `Informações de ${
        targetMember?.nickname ??
        targetMember?.displayName ??
        targetUser.username
      }`,
    )
    .setDescription(
      `${statusEmoji} ${statusTrad[rawStatus]} ${activityText}`.trim(),
    )
    .addFields(
      {
        name: "Usuário",
        value: `\`@${targetUser.username}\``,
        inline: true,
      },
      {
        name: "Menção",
        value: `${targetUser}`,
        inline: true,
      },
      {
        name: "ID",
        value: `\`${targetUser.id}\``,
        inline: true,
      },
      {
        name: "Criado",
        value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Posição de entrada",
        value: joinPosition ? `#${joinPosition}` : "-",
        inline: true,
      },
      {
        name: "Entrou",
        value:
          targetMember?.joinedTimestamp != null
            ? `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>`
            : "-",
        inline: true,
      },
      {
        name: "Distintivos",
        value: badgeList.length ? badgeList.join(" ") : "Nenhum",
        inline: false,
      },
      {
        name: "Cargos",
        value: rolesText,
        inline: false,
      },
    )
    .setColor(targetUser.accentColor ?? "Orange")
    .setFooter({
      text: `${client.user?.username ?? "App"} - ${command.name}`,
      iconURL: client.user?.displayAvatarURL({ size: 1024 }),
    })
    .setTimestamp();

  if (boost.isBooster) {
    embed.addFields({
      name: "Impulsionador",
      value: `${boost.emoji} - ${boost.tier} - \`${boost.years} ${boost.years === 1 ? "ano" : "anos"}\` \`${boost.months} ${boost.months === 1 ? "mês" : "meses"}\` \`${boost.days} ${boost.days === 1 ? "dia" : "dias"}\` \`${boost.hours} ${boost.hours === 1 ? "hora" : "horas"}\` \`${boost.minutes} ${boost.minutes === 1 ? "minuto" : "minutos"}\` \`${boost.seconds} ${boost.seconds === 1 ? "segundo" : "segundos"}\``,
      inline: false,
    });
  }

  if (stats) {
    embed.addFields(
      {
        name: "Nível",
        value: `\`Nível ${stats.level}\``,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
      {
        name: "XP",
        value: `\`${stats.exp}/${stats.level_up_exp} xp\``,
        inline: true,
      },
    );
  }

  if (hasBanner) {
    embed.setImage(banner || null);
  }

  return embed;
}
