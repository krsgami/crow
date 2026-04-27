export async function resolveAuditExecutor(guild, options) {
    if (!options.type)
        return null;
    const fetched = await guild
        .fetchAuditLogs({
        type: typeof options.type === "number" ? options.type : undefined,
        limit: 5,
    })
        .catch(() => null);
    if (!fetched)
        return null;
    const entry = fetched.entries.find((entry) => {
        if (!options.targetId)
            return true;
        const target = entry.target;
        if (!target)
            return false;
        if ("id" in target && typeof target.id === "string") {
            return target.id === options.targetId;
        }
        return false;
    });
    if (!entry)
        return null;
    return {
        executor: entry.executor ?? null,
        reason: entry.reason ?? null,
        createdTimestamp: entry.createdTimestamp ?? null,
        type: entry.targetType ?? null,
    };
}
//# sourceMappingURL=resolveAuditExecutor.js.map