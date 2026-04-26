import {
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../structures/SlashCommand.js";

export default class AvatarCommand extends SlashCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("avatar")
        .setDescription(
          "Mostra o avatar do membro da guild ou do usuário global",
        )
        .addUserOption((option) =>
          option
            .setName("alvo")
            .setDescription("O usuário/membro cujo avatar será mostrado")
            .setRequired(false),
        ),
    );
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const { client, guild } = interaction;

    const target = interaction.options.getUser("alvo") ?? interaction.user;

    const member = guild?.members.cache.get(target.id);

    const avatarUrl =
      member?.avatarURL({ size: 4096, extension: "png" }) ??
      target.displayAvatarURL({ size: 4096, extension: "png" });

    const name = member ? member.displayName : target.username;

    const embed = new EmbedBuilder()
      .setTitle(member ? `Avatar de servidor de ${name}` : `Avatar global de ${name}`)
      .setImage(avatarUrl)
      .setColor(member?.displayColor || target.accentColor || "Purple")
      .setFooter({
        text: `${client.user?.username} - ${this.data.name}`,
        iconURL: client.user.displayAvatarURL({
          size: 64,
        }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
