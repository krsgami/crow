import { ApplicationCommandType, EmbedBuilder, MessageFlags, SlashCommandBuilder, } from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
export default class HelpCommand extends SlashCommand {
    constructor() {
        super(new SlashCommandBuilder()
            .setName("help")
            .setDescription("Mostra uma lista de todos os comandos disponíveis"));
    }
    async execute(interaction) {
        const client = interaction.client;
        const guild = interaction.guild;
        const apiCommands = await guild.commands.fetch();
        // Agrupa comandos por categoria
        const categories = {};
        client.commands.forEach((cmd) => {
            const category = cmd.category || "Outros";
            if (!categories[category])
                categories[category] = [];
            if (cmd.type !== ApplicationCommandType.ChatInput)
                return;
            const apiCmd = apiCommands.find((c) => c.name === cmd.data.name);
            const cmdStr = apiCmd
                ? `</${cmd.data.name}:${apiCmd.id}>`
                : `\`${cmd.data.name}\``;
            categories[category].push(`${cmdStr} \`${cmd.data.description}\``);
        });
        // Cria embed com seções por categoria
        const embed = new EmbedBuilder()
            .setTitle("Comandos por categoria")
            .setDescription("Use os comandos clicáveis abaixo!")
            .setColor("Purple")
            .setTimestamp()
            .setFooter({ text: `total: ${client.commands.size} comandos` });
        Object.entries(categories).forEach(([category, commands]) => {
            embed.addFields({
                name: `${category}`,
                value: commands.join("\n") || "Nenhum comando",
                inline: false,
            });
        });
        await interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral],
        });
    }
}
//# sourceMappingURL=help.js.map