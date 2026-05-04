import type { PandaScoreMatch } from "../services/esports_data.service.js";

function getEmbedColorFromClubColors(clubColors?: string | null): number {
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

export const soccer = { getEmbedColorFromClubColors };

function formatDate(date: string | null | undefined) {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function getOpponentName(match: PandaScoreMatch, teamId: number) {
  const opponent = match.opponents?.find(
    (o) => o.opponent?.id !== teamId,
  )?.opponent;
  return opponent?.name ?? "Adversário desconhecido";
}

function getScore(match: PandaScoreMatch, teamId: number) {
  if (!match.results?.length) return "N/A";

  const teamResult = match.results.find((r) => r.team_id === teamId);
  const opponentResult = match.results.find((r) => r.team_id !== teamId);

  if (!teamResult || !opponentResult) return "N/A";

  return `${teamResult.score} x ${opponentResult.score}`;
}

function getLastMatch(matches: PandaScoreMatch[]) {
  return (
    matches.find(
      (m) => m.status === "finished" || m.status === "canceled" || m.end_at,
    ) ?? null
  );
}

function getNextMatch(matches: PandaScoreMatch[]) {
  return (
    [...matches]
      .filter(
        (m) => m.begin_at && m.status !== "finished" && m.status !== "canceled",
      )
      .sort(
        (a, b) =>
          new Date(a.begin_at!).getTime() - new Date(b.begin_at!).getTime(),
      )[0] ?? null
  );
}

export const esports = {
  formatDate,
  getOpponentName,
  getScore,
  getLastMatch,
  getNextMatch,
};
