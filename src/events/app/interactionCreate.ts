import { Events, MessageFlags, type CommandInteraction } from "discord.js";
import type { CROW } from "../../structures/crow.ts";
import { Logger } from "../../utils/Logger.js";

const handled = new Set<string>();

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    try {
    } catch (error) {
      Logger.error(error, `Erro ao buscar ou criar perfil do usuário:`);
      return;
    }

    if (handled.has(interaction.id)) {
      return;
    }
    handled.add(interaction.id);

    const crow = interaction.client as CROW;
    const command = crow.commands.get(interaction.commandName);
    if (!command) {
      crow.logger.error(
        `Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`,
      );

      if (!interaction.replied && !interaction.deferred) {
        await interaction
          .reply({
            content: "A interação não respondeu, tente novamente mais tarde!",
            flags: [MessageFlags.Ephemeral],
          })
          .catch(() => {});
      }
      setTimeout(() => handled.delete(interaction.id), 60_000);
      return;
    }

    const sendError = async () => {
      if (!interaction.isRepliable()) return;

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "Ocorreu um erro ao executar este comando.",
            flags: [MessageFlags.Ephemeral],
          });
        } else {
          await interaction.reply({
            content: "Ocorreu um erro ao executar este comando.",
            flags: [MessageFlags.Ephemeral],
          });
        }
      } catch {}
    };

    const executeCommand = async () => {
      await command.execute(interaction, crow);
    };

    try {
      if (
        interaction.isChatInputCommand() ||
        interaction.isContextMenuCommand()
      ) {
        await executeCommand();
      }
    } catch (error: any) {
      crow.logger.error(error, `Erro ao executar ${interaction.commandName}:`);

      if (error.code === 10062 || error.code === 40060) return;

      await sendError();
    } finally {
      setTimeout(() => handled.delete(interaction.id), 60_000);
    }
  },
};
