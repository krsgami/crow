import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
import { getTeamWithMatches } from "../../services/football_data.service.js";
import { TeamInfoEmbed } from "../../embeds/teamInfo.js";

export default class TimeSlashCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("time")
        .setDescription("Busca informações de um time")
        .addStringOption((option) =>
          option
            .setName("nome")
            .setDescription("Nome do time")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("competicao")
            .setDescription("Código da competição, ex: BSA, PL, PD, SA, BL1")
            .setRequired(false),
        ),
    );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const nome = interaction.options.getString("nome", true);
    const competicao = interaction.options.getString("competicao") ?? "BSA";

    await interaction.deferReply();

    try {
      const team = await getTeamWithMatches(nome, competicao);

      if (!team) {
        await interaction.editReply({
          content: `Não encontrei nenhum time com o nome \`${nome}\` na competição \`${competicao}\`.`,
        });
        return;
      }

      const embed = await TeamInfoEmbed(
        team.team,
        team.lastMatch,
        team.nextMatch,
        interaction,
        interaction.client,
      );

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error("Erro ao buscar time:", error);

      await interaction.editReply({
        content: "Não consegui buscar as informações do time agora.",
      });
    }
  }
}
