import { Command } from "./Command.structure.js";
export class ContextCommand extends Command {
    constructor(data) {
        super(data.name, data.type);
        this.data = data;
    }
}
//# sourceMappingURL=ContextMenu.structure.js.map