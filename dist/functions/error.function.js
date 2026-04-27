function formatError(error) {
    if (error instanceof Error) {
        return error.stack || error.message;
    }
    try {
        return JSON.stringify(error);
    }
    catch {
        return String(error);
    }
}
export { formatError };
//# sourceMappingURL=error.function.js.map