import {
  SlashCommandBuilder,
  Command,
  type CommandInteractionInteraction,
  type ApplicationCommandType,
} from "discord.js";
import type { CROW } from "../structures/crow";

export interface ICommand {
  data: SlashCommandBuilder;
  category: string;
  type: ApplicationCommandType;
  execute: (interaction: CommandInteraction, crow: CROW) => Promise<void>;
}
