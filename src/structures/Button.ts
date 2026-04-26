import { Command } from "./Command.js";
import type { ButtonInteraction } from "discord.js";

export abstract class ButtonCommand extends Command<ButtonInteraction> {
  constructor(public customId: string) {
    super(customId, "COMPONENT");
  }
}
