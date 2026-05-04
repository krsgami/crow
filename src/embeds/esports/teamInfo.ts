import {
  EmbedBuilder,
  type ChatInputCommandInteraction,
  type Client,
} from "discord.js";
import type {
  PandaScoreMatch,
  PandaScoreTeam,
} from "../../services/esports_data.service.js";
import { esports } from "../../functions/teams.function.js";

export async function TeamInfoEmbed(
  team: PandaScoreTeam,
  jogo: string,
  matches: PandaScoreMatch[],
  interaction: ChatInputCommandInteraction,
  client: Client,
) {
  const lastMatch = esports.getLastMatch(matches);
  const nextMatch = esports.getNextMatch(matches);

  const lastMatchValue = lastMatch
    ? [
        `Adversário: ${esports.getOpponentName(lastMatch, team.id)}`,
        `Status: ${lastMatch.status ?? "N/A"}`,
        `Placar: ${esports.getScore(lastMatch, team.id)}`,
        `Liga: ${lastMatch.league?.name ?? "N/A"}`,
        `Torneio: ${lastMatch.tournament?.name ?? "N/A"}`,
        `Data: ${esports.formatDate(lastMatch.begin_at)}`,
      ]
        .join("\n")
        .slice(0, 1024)
    : "Nenhum jogo recente encontrado.";

  const nextMatchValue = nextMatch
    ? [
        `Adversário: ${esports.getOpponentName(nextMatch, team.id)}`,
        `Status: ${nextMatch.status ?? "N/A"}`,
        `Liga: ${nextMatch.league?.name ?? "N/A"}`,
        `Torneio: ${nextMatch.tournament?.name ?? "N/A"}`,
        `Data: ${esports.formatDate(nextMatch.begin_at)}`,
      ]
        .join("\n")
        .slice(0, 1024)
    : "Nenhum próximo jogo encontrado.";

  const embed = new EmbedBuilder()
    .setTitle(team.name)
    .setDescription(`${jogo.toUpperCase()} Team`)
    .setThumbnail(team.image_url || null)
    .setURL(`https://pandascore.co/team/${team.id}`)
    .addFields(
      { name: "ID", value: String(team.id), inline: true },
      { name: "Slug", value: team.slug || "N/A", inline: true },
      { name: "Tag", value: team.acronym || "N/A", inline: true },
      { name: "País", value: team.location || "N/A", inline: true },
      {
        name: "Último jogo",
        value: lastMatchValue,
        inline: false,
      },
      {
        name: "Próximo jogo",
        value: nextMatchValue,
        inline: false,
      },
    )
    .setFooter({
      text: `${client.user?.username ?? "App"} - ${interaction.commandName}`,
      iconURL: client.user?.displayAvatarURL({ size: 1024 }),
    })
    .setTimestamp();

  return embed;
}
