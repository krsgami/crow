import { Command } from "./Command.js";
export class ContextCommand extends Command {
    constructor(data) {
        super(data.name, data.type);
        this.data = data;
    }
}
//# sourceMappingURL=ContextMenu.js.map