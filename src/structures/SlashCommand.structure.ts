import {
  SlashCommandBuilder,
  ApplicationCommandType,
  type ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { Command } from "./Command.structure.js";

export abstract class SlashCommand extends Command<ChatInputCommandInteraction> {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  constructor(data: SlashCommandBuilder| SlashCommandOptionsOnlyBuilder) {
    super(data.name, ApplicationCommandType.ChatInput);
    this.data = data;
  }
}
