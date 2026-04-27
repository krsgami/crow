export async function truncate(value: string, max = 1024): Promise<string> {
  if (!value.length) return "Nenhum conteúdo";
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}
