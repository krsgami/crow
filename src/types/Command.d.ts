import {
  SlashCommandBuilder,
  Command,
  type CommandInteractionInteraction,
  type ApplicationCommandType,
} from "discord.js";
import type { CrowClient } from "../structures/Client.structure.ts";

export interface ICommand {
  data: SlashCommandBuilder;
  category: string;
  type: ApplicationCommandType;
  execute: (interaction: CommandInteraction, crow: CrowClient) => Promise<void>;
}
