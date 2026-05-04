import { ActionRowBuilder, ButtonBuilder, ButtonStyle, } from "discord.js";
import { Command } from "./Command.structure.js";
export class ButtonCommand extends Command {
    constructor(options) {
        super(options.customId, "COMPONENT");
        this.customId = options.customId;
        this.label = options.label;
        this.style = options.style ?? ButtonStyle.Primary;
        this.emoji = options.emoji;
        this.disabled = options.disabled ?? false;
    }
    makeCustomId(...parts) {
        return [this.customId, ...parts].join(":");
    }
    component(customId = this.customId) {
        const button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(this.label)
            .setStyle(this.style)
            .setDisabled(this.disabled);
        if (this.emoji) {
            button.setEmoji(this.emoji);
        }
        return button;
    }
    componentWith(...parts) {
        return this.component(this.makeCustomId(...parts));
    }
    row(customId = this.customId) {
        return new ActionRowBuilder().addComponents(this.component(customId));
    }
    rowWith(...parts) {
        return this.row(this.makeCustomId(...parts));
    }
}
//# sourceMappingURL=Button.structure.js.map