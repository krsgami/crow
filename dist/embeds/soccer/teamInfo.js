import { EmbedBuilder, } from "discord.js";
import { getEmbedColorFromClubColors } from "../../functions/teams.function.js";
function formatMatch(match) {
    if (!match)
        return "Não encontrada";
    const home = match.homeTeam?.shortName || match.homeTeam?.name || "Casa";
    const away = match.awayTeam?.shortName || match.awayTeam?.name || "Fora";
    const competition = match.competition?.name ?? "Competição";
    if (match.status === "FINISHED") {
        const homeScore = match.score?.fullTime?.home ?? "-";
        const awayScore = match.score?.fullTime?.away ?? "-";
        return [
            `**${home}** ${homeScore} x ${awayScore} **${away}**`,
            `🏆 ${competition}`,
            `⏰ <t:${Math.floor(new Date(match.utcDate).getTime() / 1000)}:R>`,
        ].join("\n");
    }
    return [
        `**${home}** x **${away}**`,
        `🏆 ${competition}`,
        `⏰ <t:${Math.floor(new Date(match.utcDate).getTime() / 1000)}:F>`,
    ].join("\n");
}
export async function TeamInfoEmbed(team, lastMatch, nextMatch, interaction, client) {
    const embed = new EmbedBuilder()
        .setTitle(team.shortName || team.name)
        .setDescription(`${team.area?.name
        ? `🌍 País: \`${team.area.name == "Brazil" ? "Brasil" : team.area.name}\``
        : null} - ${team.tla ? `🏷️ Sigla: \`${team.tla}\`` : null}`)
        .addFields({
        name: "Nome",
        value: team.name || "Não informado",
        inline: true,
    }, {
        name: "ID",
        value: `\`${team.id}\``,
        inline: true,
    }, {
        name: "Fundação",
        value: team.founded ? `\`${team.founded}\`` : "Não informado",
        inline: true,
    }, {
        name: "Estádio",
        value: team.venue || "Não informado",
        inline: true,
    }, {
        name: "Cores",
        value: team.clubColors || "Não informado",
        inline: true,
    }, {
        name: "País/Área",
        value: team.area?.name || "Não informado",
        inline: true,
    }, {
        name: "Última partida",
        value: formatMatch(lastMatch),
        inline: false,
    }, {
        name: "Próxima partida",
        value: formatMatch(nextMatch),
        inline: false,
    }, {
        name: "Site",
        value: team.website
            ? `[Acessar site](${team.website})`
            : "Não informado",
        inline: false,
    }, {
        name: "Endereço",
        value: team.address || "Não informado",
        inline: false,
    })
        .setColor(getEmbedColorFromClubColors(team.clubColors))
        .setFooter({
        text: `${client.user?.username ?? "App"} - ${interaction.commandName}`,
        iconURL: client.user?.displayAvatarURL({ size: 1024 }),
    })
        .setTimestamp();
    if (team.crest) {
        embed.setThumbnail(team.crest);
    }
    return embed;
}
//# sourceMappingURL=teamInfo.js.map