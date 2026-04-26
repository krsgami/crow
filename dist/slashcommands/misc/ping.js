import { SlashCommandBuilder, MessageFlags, } from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.js";
export default class PingCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Testar latência do bot"));
    }
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const reply = await interaction.fetchReply();
        const latency = reply.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply({
            content: `Pong! ${latency}ms`,
        });
    }
}
//# sourceMappingURL=ping.js.map