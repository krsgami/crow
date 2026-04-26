import { ApplicationCommandType, } from "discord.js";
import { Command } from "./Command.js";
export class SlashCommand extends Command {
    constructor(data) {
        super(data.name, ApplicationCommandType.ChatInput);
        this.data = data;
    }
}
//# sourceMappingURL=SlashCommand.js.map