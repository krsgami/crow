import { ButtonStyle, MessageFlags } from "discord.js";
import { ButtonCommand } from "../../../structures/Button.structure.js";
import { getTeamById } from "../../../services/football_data.service.js";
import { upsertUserFavorite } from "../../../services/favorites.service.js";
export default class FavoriteSoccerTeamButton extends ButtonCommand {
    constructor() {
        super({
            customId: "favorite_soccer_team",
            label: "Definir como meu time",
            style: ButtonStyle.Primary,
        });
    }
    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const [, rawTeamId, competitionCode] = interaction.customId.split(":");
        const teamId = Number(rawTeamId);
        if (!teamId || Number.isNaN(teamId)) {
            await interaction.editReply({
                content: "Não consegui identificar esse time.",
            });
            return;
        }
        const team = await getTeamById(teamId);
        await upsertUserFavorite({
            discordId: interaction.user.id,
            category: "football_team",
            externalId: String(team.id),
            name: team.name,
            shortName: team.shortName ?? null,
            code: team.tla ?? null,
            imageUrl: team.crest ?? null,
            source: "football-data",
            metadata: {
                competitionCode,
                area: team.area?.name ?? null,
            },
        });
        await interaction.editReply({
            content: `O seu time agora é **${team.shortName || team.name}**.`,
        });
    }
}
//# sourceMappingURL=favorite_soccer_team.button.js.map