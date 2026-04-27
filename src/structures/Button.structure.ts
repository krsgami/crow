import { Command } from "./Command.structure.js";
import type { ButtonInteraction } from "discord.js";

export abstract class ButtonCommand extends Command<ButtonInteraction> {
  constructor(public customId: string) {
    super(customId, "COMPONENT");
  }
}
