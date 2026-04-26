import { Events } from "discord.js";
import type { CROW } from "../../structures/crow.ts";
import chalk from "chalk";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: CROW) {
    client.user &&
      client.logger.info(
        `Logado como ${chalk.magentaBright(client.user.username)}`
      );
  },
};
