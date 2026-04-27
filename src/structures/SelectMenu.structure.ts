import { Command } from "./Command.structure.js";
import type { StringSelectMenuInteraction } from "discord.js";

export abstract class SelectMenuCommand extends Command<StringSelectMenuInteraction> {
  constructor(public customId: string) {
    super(customId, "COMPONENT");
  }
}
