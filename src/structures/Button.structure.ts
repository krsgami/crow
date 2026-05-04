import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ButtonInteraction,
  type APIMessageComponentEmoji,
} from "discord.js";
import { Command } from "./Command.structure.js";

type ButtonCommandOptions = {
  customId: string;
  label: string;
  style?: ButtonStyle;
  emoji?: APIMessageComponentEmoji | string;
  disabled?: boolean;
};

export abstract class ButtonCommand extends Command<ButtonInteraction> {
  public customId: string;
  public label: string;
  public style: ButtonStyle;
  public emoji?: APIMessageComponentEmoji | string;
  public disabled: boolean;

  constructor(options: ButtonCommandOptions) {
    super(options.customId, "COMPONENT");
    this.customId = options.customId;
    this.label = options.label;
    this.style = options.style ?? ButtonStyle.Primary;
    this.emoji = options.emoji;
    this.disabled = options.disabled ?? false;
  }

  protected makeCustomId(...parts: (string | number)[]) {
    return [this.customId, ...parts].join(":");
  }

  component(customId = this.customId) {
    const button = new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(this.label)
      .setStyle(this.style)
      .setDisabled(this.disabled);

    if (this.emoji) {
      button.setEmoji(this.emoji);
    }

    return button;
  }

  componentWith(...parts: (string | number)[]) {
    return this.component(this.makeCustomId(...parts));
  }

  row(customId = this.customId) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      this.component(customId),
    );
  }

  rowWith(...parts: (string | number)[]) {
    return this.row(this.makeCustomId(...parts));
  }
}
