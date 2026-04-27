import { ApplicationCommandType, type Interaction } from "discord.js";
import type { CrowClient } from "./Client.structure.js";

export abstract class Command<T extends Interaction = Interaction> {
  name: string;
  type: ApplicationCommandType | "COMPONENT";
  category: string = "Uncategorized";

  constructor(name: string, type: ApplicationCommandType | "COMPONENT") {
    this.name = name;
    this.type = type;
  }

  abstract execute(interaction: T, app: CrowClient): Promise<void>;
}
