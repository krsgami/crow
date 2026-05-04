import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  MessageFlags,
} from "discord.js";
import { ContextCommand } from "../../structures/ContextMenu.structure.js";
import { ServerInfoEmbed } from "../../embeds/info/serverinfo.js";

export default class ServerInfoContextCommand extends ContextCommand {
  constructor() {
    super(
      new ContextMenuCommandBuilder()
        .setName("Informações do Servidor")
        .setType(ApplicationCommandType.Message),
    );
  }

  async execute(interaction: ContextMenuCommandInteraction) {
    const { guild, user, client } = interaction;

    if (!guild) {
      await interaction.reply({
        content: "Este comando só pode ser usado dentro de um servidor.",
        flags: [MessageFlags.Ephemeral],
      });
    }

    const embed = await ServerInfoEmbed(guild!, user, this.data, client);

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
