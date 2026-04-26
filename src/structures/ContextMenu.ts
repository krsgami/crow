import {
  ContextMenuCommandBuilder,
  type MessageContextMenuCommandInteraction,
} from "discord.js";
import { Command } from "./Command.js";

export abstract class ContextCommand extends Command<MessageContextMenuCommandInteraction> {
  data: ContextMenuCommandBuilder;

  constructor(data: ContextMenuCommandBuilder) {
    super(data.name, data.type);
    this.data = data;
  }
}
