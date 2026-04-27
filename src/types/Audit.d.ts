import type { APIEmbedField, ColorResolvable } from "discord.js";

export interface AuditPayload {
  title: string;
  description?: string;
  color?: ColorResolvable;
  fields?: APIEmbedField[];
  thumbnailURL?: string;
  imageURL?: string;
  footer?: string;
  timestamp?: Date;
}

export interface AuditContext {
  guild: Guild;
  type?: AuditLogEvent | string | null;
  targetId?: string;
}
