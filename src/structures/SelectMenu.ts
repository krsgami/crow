import { Command } from "./Command.js";
import type { StringSelectMenuInteraction } from "discord.js";

export abstract class SelectMenuCommand extends Command<StringSelectMenuInteraction> {
  constructor(public customId: string) {
    super(customId, "COMPONENT");
  }
}
