import { MessageFlags, SlashCommandBuilder, } from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
import { ServerInfoEmbed } from "../../embeds/info/serverinfo.js";
export default class ServerInfoCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName("serverinfo")
            .setDescription("Mostra informações sobre o servidor atual"));
    }
    async execute(interaction) {
        const { client, guild, user } = interaction;
        const embed = await ServerInfoEmbed(guild, user, this.data, client);
        await interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral],
        });
    }
}
//# sourceMappingURL=serverinfo.js.map