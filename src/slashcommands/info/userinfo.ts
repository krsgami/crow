import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.structure.js";
import { UserInfoEmbed } from "../../embeds/info/userinfo.js";

export default class UserInfoCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Obter informações sobre um usuário")
        .addUserOption((option) =>
          option
            .setName("alvo")
            .setDescription("O usuário sobre o qual obter informações")
            .setRequired(false),
        ),
    );
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const { client, user, guild, member } = interaction;

    const targetUser =
      interaction.options.getUser("alvo") || interaction.user;
    const targetMember = await guild?.members.fetch(targetUser);

    await interaction.reply({
      embeds: [
        await UserInfoEmbed(targetUser, targetMember!, user, this.data, client),
      ],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
