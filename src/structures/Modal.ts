import { Command } from "./Command.js";
import type { ModalSubmitInteraction } from "discord.js";

export abstract class ModalCommand extends Command<ModalSubmitInteraction> {
  constructor(public customId: string) {
    super(customId, "COMPONENT");
  }
}
