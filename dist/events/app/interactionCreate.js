import { Events, MessageFlags } from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
const handled = new Set();
export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        const client = interaction.client;
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (command instanceof SlashCommand) {
                try {
                    await command.autocomplete(interaction);
                }
                catch (e) {
                    client.logger.error(e, "Erro autocomplete:");
                    await interaction.respond([]).catch(() => { });
                }
            }
            return;
        }
        if (interaction.isButton()) {
            const baseCustomId = interaction.customId.split(":")[0];
            const button = client.buttons.get(baseCustomId);
            if (!button) {
                await interaction
                    .reply({
                    content: "Botão não encontrado.",
                    flags: [MessageFlags.Ephemeral],
                })
                    .catch(() => { });
                return;
            }
            try {
                await button.execute(interaction, client);
            }
            catch (error) {
                client.logger.error(error, `Erro ao executar botão ${interaction.customId}:`);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction
                        .reply({
                        content: "Ocorreu um erro ao executar este botão.",
                        flags: [MessageFlags.Ephemeral],
                    })
                        .catch(() => { });
                }
            }
            return;
        }
        if (!interaction.isChatInputCommand() &&
            !interaction.isContextMenuCommand()) {
            return;
        }
        if (handled.has(interaction.id)) {
            return;
        }
        handled.add(interaction.id);
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            client.logger.error(`Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`);
            if (!interaction.replied && !interaction.deferred) {
                await interaction
                    .reply({
                    content: "Esse comando não foi encontrado.",
                    flags: [MessageFlags.Ephemeral],
                })
                    .catch(() => { });
            }
            setTimeout(() => handled.delete(interaction.id), 60000);
            return;
        }
        const sendError = async () => {
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "Ocorreu um erro ao executar este comando.",
                        flags: [MessageFlags.Ephemeral],
                    });
                }
                else {
                    await interaction.reply({
                        content: "Ocorreu um erro ao executar este comando.",
                        flags: [MessageFlags.Ephemeral],
                    });
                }
            }
            catch { }
        };
        try {
            await command.execute(interaction, client);
        }
        catch (error) {
            client.logger.error(error, `Erro ao executar ${interaction.commandName}:`);
            if (error.code !== 10062 && error.code !== 40060) {
                await sendError();
            }
        }
        finally {
            setTimeout(() => handled.delete(interaction.id), 60000);
        }
    },
};
//# sourceMappingURL=interactionCreate.js.map