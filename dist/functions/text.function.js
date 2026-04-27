export async function truncate(value, max = 1024) {
    if (!value.length)
        return "Nenhum conteúdo";
    return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}
//# sourceMappingURL=text.function.js.map