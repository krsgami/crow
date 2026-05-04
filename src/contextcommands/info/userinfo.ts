import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  MessageFlags,
} from "discord.js";
import { ContextCommand } from "../../structures/ContextMenu.structure.js";
import { UserInfoEmbed } from "../../embeds/info/userinfo.js";

export default class UserInfoContextCommand extends ContextCommand {
  constructor() {
    super(
      new ContextMenuCommandBuilder()
        .setName("Informações do Usuário")
        .setType(ApplicationCommandType.User),
    );
  }
  async execute(interaction: ContextMenuCommandInteraction) {
    const userId = interaction.targetId;
    const targetUser = await interaction.client.users.fetch(userId);
    const member = await interaction.guild?.members.fetch(userId);
    const { user, client } = interaction;

    const embed = await UserInfoEmbed(
      targetUser,
      member!,
      user,
      this.data,
      client,
    );

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
