import { Command } from "./Command.structure.js";
export class ButtonCommand extends Command {
    constructor(customId) {
        super(customId, "COMPONENT");
        this.customId = customId;
    }
}
//# sourceMappingURL=Button.structure.js.map