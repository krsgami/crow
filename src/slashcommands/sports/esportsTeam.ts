import {
  SlashCommandBuilder,
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
import {
  searchEsportsTeams,
  getEsportsTeamById,
  type EsportsGame,
  getTeamMatches,
} from "../../services/esports_data.service.js";
import FavoriteEsportsTeamButton from "../../components/buttons/favorites/esports_team.button.js";
import { TeamInfoEmbed } from "../../embeds/esports/teamInfo.js";

const ESPORTS_GAMES = [
  { name: "League of Legends", value: "lol" },
  { name: "Counter-Strike", value: "cs" },
  { name: "Rocket League", value: "rl" },
];

export default class EsportsTeamSlashCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("esportsteam")
        .setDescription("Busca informações de um time de esports")
        .addStringOption((option) =>
          option
            .setName("jogo")
            .setDescription("Escolha o jogo")
            .setRequired(true)
            .addChoices(...ESPORTS_GAMES),
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

    const jogo = (interaction.options.getString("jogo") ??
      "lol") as EsportsGame;
    const query = String(focused.value ?? "").trim();

    if (query.length < 2) {
      await interaction.respond([]);
      return;
    }

    try {
      const teams = await searchEsportsTeams({
        game: jogo,
        search: query,
        perPage: 25,
      });

      await interaction.respond(
        teams.slice(0, 25).map((team) => ({
          name: `${team.name}${team.acronym ? ` (${team.acronym})` : ""}`.slice(
            0,
            100,
          ),
          value: String(team.id),
        })),
      );
    } catch (error) {
      console.error("Erro no autocomplete de time de esports:", error);
      await interaction.respond([]);
    }
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const teamId = Number(interaction.options.getString("nome", true));
    const jogo = interaction.options.getString("jogo", true) as EsportsGame;

    await interaction.deferReply();

    try {
      if (!Number.isFinite(teamId)) {
        await interaction.editReply({
          content: "Selecione um time válido pelo autocomplete.",
        });
        return;
      }

      const team = await getEsportsTeamById(jogo, teamId);
      const matches = await getTeamMatches(team.id);

      const embed = await TeamInfoEmbed(
        team,
        jogo,
        matches,
        interaction,
        interaction.client,
      );

      const favoriteButton = new FavoriteEsportsTeamButton();

      await interaction.editReply({
        embeds: [embed],
        components: [favoriteButton.rowWith(jogo, team.id)],
      });
    } catch (error) {
      console.error("Erro ao buscar time de esports:", error);
      await interaction.editReply({
        content: "Não consegui buscar as informações do time de esports agora.",
      });
    }
  }
}
