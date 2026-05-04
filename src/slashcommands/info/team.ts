import {
  SlashCommandBuilder,
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
import {
  getTeamWithMatches,
  searchTeams,
} from "../../services/football_data.service.js";
import { TeamInfoEmbed } from "../../embeds/soccer/teamInfo.js";
import FavoriteTeamButton from "../../components/buttons/favorites/favorite_soccer_team.button.js";

const FOOTBALL_COMPETITIONS = [
  { name: "Brasileirão Série A", value: "BSA" },
  { name: "Premier League", value: "PL" },
  { name: "La Liga", value: "PD" },
  { name: "Serie A", value: "SA" },
  { name: "Bundesliga", value: "BL1" },
  { name: "Ligue 1", value: "FL1" },
  { name: "Champions League", value: "CL" },
  { name: "Primeira Liga", value: "PPL" },
];

export default class TimeSlashCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("time")
        .setDescription("Busca informações de um time")
        .addStringOption((option) =>
          option
            .setName("competicao")
            .setDescription("Escolha a competição")
            .setRequired(true)
            .addChoices(...FOOTBALL_COMPETITIONS),
        )
        .addStringOption((option) =>
          option
            .setName("nome")
            .setDescription("Nome do time")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    );
  }

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);

    if (focused.name !== "nome") {
      await interaction.respond([]);
      return;
    }

    const competicao = interaction.options.getString("competicao") ?? "BSA";
    const query = String(focused.value ?? "").trim();

    try {
      const teams = await searchTeams(query, competicao);

      await interaction.respond(
        teams.slice(0, 25).map((team) => ({
          name: `${team.name}${team.tla ? ` (${team.tla})` : ""}`,
          value: team.name,
        })),
      );
    } catch (error) {
      console.error("Erro no autocomplete de time:", error);
      await interaction.respond([]);
    }
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const nome = interaction.options.getString("nome", true);
    const competicao = interaction.options.getString("competicao", true);

    await interaction.deferReply();

    try {
      const result = await getTeamWithMatches(nome, competicao);

      if (!result) {
        await interaction.editReply({
          content: `Não encontrei nenhum time com o nome \`${nome}\` na competição \`${competicao}\`.`,
        });
        return;
      }

      const embed = await TeamInfoEmbed(
        result.team,
        result.lastMatch,
        result.nextMatch,
        interaction,
        interaction.client,
      );

      const favoriteTeamButton = new FavoriteTeamButton();

      await interaction.editReply({
        embeds: [embed],
        components: [favoriteTeamButton.rowWith(result.team.id, competicao)],
      });
    } catch (error) {
      console.error("Erro ao buscar time:", error);

      await interaction.editReply({
        content: "Não consegui buscar as informações do time agora.",
      });
    }
  }
}
