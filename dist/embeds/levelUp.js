import { EmbedBuilder } from "discord.js";
export async function levelUpEmbed(user, oldLevel, newLevel, levelsGained, currentExp, levelUpExp, xpGained, guild) {
    const progress = Math.round((currentExp / levelUpExp) * 100);
    const progressBar = "█".repeat(Math.floor(progress / 5)) +
        "░".repeat(20 - Math.floor(progress / 5));
    const embed = new EmbedBuilder()
        .setColor("Green")
        .setAuthor({
        name: `${user.username} subiu de nível! 🎉`,
        iconURL: user.displayAvatarURL({ size: 1024 }),
    })
        .setThumbnail(user.displayAvatarURL({ size: 1024 }))
        .addFields({
        name: "Progresso",
        value: `\`[${progressBar}]\` - ${progress}%\n\`${currentExp.toLocaleString()}/${levelUpExp.toLocaleString()}\` xp`,
        inline: false,
    }, {
        name: `Nível Anterior`,
        value: `\`${oldLevel}\``,
        inline: true,
    }, {
        name: `Novo Nível`,
        value: `\`${newLevel}\` ${levelsGained > 1 ? ` (+${levelsGained})` : ""}`,
        inline: true,
    }, {
        name: "XP Ganho",
        value: `\`${xpGained.toLocaleString()} XP\``,
        inline: true,
    })
        .setFooter({
        text: `${guild.name}`,
        iconURL: user.client.user.avatarURL({ size: 1024 }),
    })
        .setTimestamp();
    return embed;
}
//# sourceMappingURL=levelUp.js.map