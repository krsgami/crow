import dotenv from "dotenv";
dotenv.config({ path: ".env" });
if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: ".env.development", override: true });
}
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env.production", override: true });
}
import { CrowClient } from "./structures/Client.structure.js";
import chalk from "chalk";
import { GatewayIntentBits, Partials } from "discord.js";
const client = new CrowClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel],
});
(async () => {
    await client.initialize().catch((error) => {
        console.error(chalk.redBright("[ERROR] "), "Falha ao inicializar o bot:", error);
        process.exit(1);
    });
})().catch((error) => {
    console.error(chalk.redBright("[ERROR] "), "Erro inesperado durante a inicialização do bot:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map