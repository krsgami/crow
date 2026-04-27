import chalk from "chalk";
function getTimestamp() {
    return new Date().toLocaleTimeString();
}
function normalizeError(input) {
    if (input instanceof Error) {
        return [`${input.name}: ${input.message}`, input.stack ? input.stack : ""]
            .filter(Boolean)
            .join("\n");
    }
    if (typeof input === "string") {
        return input;
    }
    try {
        return JSON.stringify(input, null, 2);
    }
    catch {
        return String(input);
    }
}
export const Logger = {
    log(message) {
        console.log(chalk.whiteBright("[LOG] ") + `${getTimestamp()} - ` + message + `\n`);
    },
    module(message) {
        console.log(chalk.magentaBright("[MODULO] ") + `${getTimestamp()} - ` + message);
    },
    success(message) {
        console.log(chalk.greenBright("[SUCESSO] ") + `${getTimestamp()} - ` + message + `\n`);
    },
    error(error, context) {
        const formatted = normalizeError(error);
        console.error(chalk.redBright("[ERRO] ") +
            `${getTimestamp()} - ` +
            (context ? `${context}\n${formatted}` : formatted) +
            `\n`);
    },
    warn(message) {
        console.warn(chalk.yellowBright("[AVISO] ") + `${getTimestamp()} - ` + message + `\n`);
    },
    info(message) {
        console.info(chalk.blueBright("[INFO] ") + `${getTimestamp()} - ` + message + `\n`);
    },
};
//# sourceMappingURL=Logger.util.js.map