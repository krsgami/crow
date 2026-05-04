import { ButtonStyle, MessageFlags, type ButtonInteraction } from "discord.js";
import { ButtonCommand } from "../../../structures/Button.structure.js";
import { createUserFavorite } from "../../../repositories/userFavorites.repository.js";
import { ensureUserContextById } from "../../../services/context.service.js";
import { getEsportsTeamById } from "../../../services/esports_data.service.js";

type EsportsGame = "lol" | "cs" | "rl";

export default class FavoriteEsportsTeamButton extends ButtonCommand {
  constructor() {
    super({
      customId: "favorite_esports_team",
      label: "Definir como meu time",
      style: ButtonStyle.Primary,
    });
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const [, game, rawTeamId] = interaction.customId.split(":") as [
      string,
      EsportsGame,
      string,
    ];

    const teamId = Number(rawTeamId);

    if (!game || !teamId || Number.isNaN(teamId)) {
      await interaction.editReply({
        content: "Não consegui identificar esse time de esports.",
      });
      return;
    }

    const { user } = await ensureUserContextById(interaction.user.id);
    const team = await getEsportsTeamById(game, teamId);

    await createUserFavorite({
      userId: user.id,
      category: "esports_team",
      externalId: String(team.id),
      name: team.name,
      shortName: team.acronym ?? null,
      code: team.acronym ?? null,
      imageUrl: team.image_url ?? null,
      source: "pandascore",
      metadata: {
        game,
        slug: team.slug ?? null,
      },
    });

    await interaction.editReply({
      content: `Seu time favorito de esports agora é **${team.name}**.`,
    });
  }
}
