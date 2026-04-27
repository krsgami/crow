import { Events } from "discord.js";
import type { CrowClient } from "../../structures/Client.structure.js";
import chalk from "chalk";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: CrowClient) {
    client.user &&
      client.logger.info(
        `Logado como ${chalk.magentaBright(client.user.username)}`,
      );
  },
};
