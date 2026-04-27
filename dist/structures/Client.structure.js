import { Client, Collection, REST, Routes, } from "discord.js";
import path from "path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import { Logger } from "../utils/Logger.util.js";
import chalk from "chalk";
import { Guild } from "../utils/Guild.util.js";
import * as promise from "node:dns/promises";
import { formatError } from "../functions/error.function.js";
import { AuditService } from "../modules/audit/AuditService.js";
promise.setServers(["1.1.1.1", "8.8.8.8"]);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export class CrowClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.logger = Logger;
        this.bootstraps = {
            guildSyncStarted: false,
        };
        this.auditService = new AuditService(this, Guild.channels.logs);
    }
    async loadCommands(commandPath) {
        try {
            let commandCount = 0;
            const categories = readdirSync(commandPath);
            for (const category of categories) {
                const commandFiles = readdirSync(path.join(commandPath, category)).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
                for (const file of commandFiles) {
                    const filePath = path.join(commandPath, category, file);
                    const CommandClass = (await import(`file://${filePath}`)).default;
                    if (typeof CommandClass !== "function") {
                        this.logger.warn(`Comando inválido (não é uma classe) em ${filePath}`);
                        continue;
                    }
                    const command = new CommandClass();
                    let typeLabel = "unknown";
                    if (command.type === "COMPONENT") {
                        // diferencia botão, select, modal pelo nome/customId (opcional)
                        typeLabel = "component";
                    }
                    if (command.type === 1) {
                        typeLabel = "slashcommand";
                    }
                    if (command.type === 2) {
                        typeLabel = "usercontext";
                    }
                    if (command.type === 3) {
                        typeLabel = "messagecontext";
                    }
                    if (command) {
                        command.category = category;
                        const key = command.data?.name ?? command.name;
                        this.commands.set(key, command);
                        commandCount++;
                        let name;
                        try {
                            name =
                                command.data?.toJSON?.().name ??
                                    command.data?.name ??
                                    command.name;
                        }
                        catch {
                            name = command.name;
                        }
                        name = String(name);
                        this.logger.module(`Loaded ${chalk.cyanBright(typeLabel)}: ${chalk.yellowBright(name)}`);
                    }
                    else {
                        this.logger.warn(`Falha ao carregar comando em ${filePath}`);
                    }
                }
            }
            this.logger.info(chalk.cyanBright(`${commandCount} comando(s) carregado(s)`));
        }
        catch (error) {
            this.logger.error(`Falha ao carregar comandos: ${formatError(error)}`);
        }
    }
    async loadEvents(eventPath) {
        try {
            let eventCount = 0;
            const categories = readdirSync(eventPath);
            for (const category of categories) {
                const categoriesPath = path.join(eventPath, category);
                const eventFiles = readdirSync(categoriesPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
                for (const file of eventFiles) {
                    const filePath = path.join(categoriesPath, file);
                    const eventImport = await import(`file://${filePath}`);
                    const event = eventImport.default;
                    if (event && event.name) {
                        if (event.once) {
                            this.once(event.name, (...args) => event.execute(...args));
                        }
                        else {
                            this.on(event.name, (...args) => event.execute(...args));
                        }
                        eventCount++;
                        this.logger.module(`Evento carregado: ${chalk.yellowBright(event.name)} - ${chalk.magentaBright(file)} da categoria: ${chalk.blueBright(category)}`);
                    }
                    else {
                        this.logger.warn(`Falha ao carregar evento em ${filePath} - Propriedade ${chalk.yellowBright("'name'")} está faltando`);
                    }
                }
            }
            this.logger.info(chalk.greenBright(`${eventCount} evento(s) carregado(s)`));
        }
        catch (error) {
            this.logger.error(`Falha ao carregar eventos: ${formatError(error)}`);
        }
    }
    async registerSlashCommands() {
        try {
            const commands = Array.from(this.commands.values()).map((cmd) => cmd.data.toJSON());
            const rest = new REST().setToken(process.env.CROW_TOKEN);
            this.logger.log("Registrando comandos de barra (/)...");
            const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, Guild.ID), { body: commands });
            this.logger.success(`Comando(s) de barra (/) ${chalk.cyanBright(data.length + " registrado(s) com sucesso!")}`);
        }
        catch (error) {
            this.logger.error(`Falha ao registrar comandos de barra (/): ${formatError(error)}`);
        }
    }
    async initialize() {
        try {
            console.log(`[NODE_ENV]=[${process.env.NODE_ENV}]`);
            console.log(process.env.NODE_ENV?.length);
            const slashCommandPath = path.join(__dirname, "..", "slashcommands");
            const ctxCommandPath = path.join(__dirname, "..", "contextcommands");
            const eventPath = path.join(__dirname, "..", "events");
            this.logger.log(`${chalk.magentaBright("crow APP")} is starting...`);
            await this.loadCommands(slashCommandPath);
            await this.loadCommands(ctxCommandPath);
            await this.loadEvents(eventPath);
            await this.registerSlashCommands();
            await this.login(process.env.CROW_TOKEN).then(() => this.logger.success(`${chalk.magenta("crow")} iniciou com sucesso!`));
        }
        catch (error) {
            this.logger.error(`Inicialização falhou: ${formatError(error)}`);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=Client.structure.js.map