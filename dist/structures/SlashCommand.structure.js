import { ApplicationCommandType, } from "discord.js";
import { Command } from "./Command.structure.js";
export class SlashCommand extends Command {
    constructor(data) {
        super(data.name, ApplicationCommandType.ChatInput);
        this.data = data;
    }
    async autocomplete(_interaction) {
        return;
    }
}
//# sourceMappingURL=SlashCommand.structure.js.map