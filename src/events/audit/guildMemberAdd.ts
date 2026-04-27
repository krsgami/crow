import { EmbedBuilder, Events, type GuildMember } from "discord.js";
import { auditColors } from "../../modules/audit/AuditColors.js";
import type { CrowClient } from "../../structures/Client.structure.js";

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const client = member.client as CrowClient;

    const embed = new EmbedBuilder()
      .setTitle("Membro entrou")
      .setDescription(`${member.user} entrou no bar.`)
      .setColor(auditColors.memberAdd)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp(new Date())
      .addFields(
        {
          name: "Usuário",
          value: `${member.user.tag}\n\`${member.id}\``,
          inline: true,
        },
        {
          name: "Conta criada em",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Entrou em",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true,
        },
      );

    await client.auditService.send(embed);
  },
};
