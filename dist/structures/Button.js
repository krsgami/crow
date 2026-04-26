import { Command } from "./Command.js";
export class ButtonCommand extends Command {
    constructor(customId) {
        super(customId, "COMPONENT");
        this.customId = customId;
    }
}
//# sourceMappingURL=Button.js.map