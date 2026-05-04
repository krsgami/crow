export function getEmbedColorFromClubColors(
  clubColors?: string | null,
): number {
  if (!clubColors) return 0x57f287;

  const firstColor = clubColors
    .split("/")
    .map((color) => color.trim().toLowerCase())
    .filter(Boolean)[0];

  if (!firstColor) return 0x57f287;

  const colorMap: Record<string, string> = {
    red: "#ED4245",
    blue: "#3498DB",
    green: "#57F287",
    yellow: "#FEE75C",
    orange: "#E67E22",
    purple: "#9B59B6",
    white: "#FFFFFF",
    black: "#23272A",
    grey: "#95A5A6",
    gray: "#95A5A6",
    gold: "#F1C40F",
    maroon: "#992D22",
    navy: "#206694",
    aqua: "#1ABC9C",
    teal: "#11806A",
    pink: "#EB459E",
  };

  if (firstColor.startsWith("#")) {
    return parseInt(firstColor.replace("#", ""), 16);
  }

  const mapped = colorMap[firstColor];
  if (mapped) {
    return parseInt(mapped.replace("#", ""), 16);
  }

  return 0x57f287;
}
