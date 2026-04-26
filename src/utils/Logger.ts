import chalk from "chalk";

type LogValue = string | Error | unknown;

function getTimestamp(): string {
  return new Date().toLocaleTimeString();
}

function normalizeError(input: LogValue): string {
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
  } catch {
    return String(input);
  }
}

export const Logger = {
  log(message: string): void {
    console.log(
      chalk.whiteBright("[LOG] ") + `${getTimestamp()} - ` + message + `\n`,
    );
  },

  module(message: string): void {
    console.log(
      chalk.magentaBright("[MODULO] ") + `${getTimestamp()} - ` + message,
    );
  },

  success(message: string): void {
    console.log(
      chalk.greenBright("[SUCESSO] ") + `${getTimestamp()} - ` + message + `\n`,
    );
  },

  error(error: LogValue, context?: string): void {
    const formatted = normalizeError(error);

    console.error(
      chalk.redBright("[ERRO] ") +
        `${getTimestamp()} - ` +
        (context ? `${context}\n${formatted}` : formatted) +
        `\n`,
    );
  },

  warn(message: string): void {
    console.warn(
      chalk.yellowBright("[AVISO] ") + `${getTimestamp()} - ` + message + `\n`,
    );
  },

  info(message: string): void {
    console.info(
      chalk.blueBright("[INFO] ") + `${getTimestamp()} - ` + message + `\n`,
    );
  },
};
