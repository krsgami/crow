const BASE_URL = "https://api.football-data.org/v4";

const API_TOKEN = process.env.FOOTBALL_DATA_TOKEN;

if (!API_TOKEN) {
  throw new Error("FOOTBALL_DATA_TOKEN não foi definido no ambiente.");
}

export type FootballArea = {
  id: number;
  name: string;
  code?: string;
  flag?: string | null;
};

export type FootballCompetition = {
  id: number;
  name: string;
  code: string;
  type?: string;
  emblem?: string | null;
};

export type FootballTeam = {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string | null;
  area?: FootballArea;
  runningCompetitions?: FootballCompetition[];
};

type CompetitionTeamsResponse = {
  count: number;
  competition: FootballCompetition;
  season?: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday?: number;
  };
  teams: FootballTeam[];
};

export type FootballMatchTeam = {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
};

export type FootballMatchScore = {
  winner?: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  fullTime?: {
    home?: number | null;
    away?: number | null;
  };
};

export type FootballMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  homeTeam: FootballMatchTeam;
  awayTeam: FootballMatchTeam;
  competition?: {
    id: number;
    name: string;
    code?: string;
    emblem?: string | null;
  };
  score?: FootballMatchScore;
};

type TeamMatchesResponse = {
  filters?: Record<string, unknown>;
  resultSet?: {
    count: number;
    first?: string;
    last?: string;
    played?: number;
  };
  matches: FootballMatch[];
};

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "X-Auth-Token": API_TOKEN!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `football-data error ${response.status}: ${text || "sem detalhes"}`,
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Busca os dados completos de um time por ID
 */
export async function getTeamById(teamId: number): Promise<FootballTeam> {
  return request<FootballTeam>(`/teams/${teamId}`);
}

/**
 * Lista os times de uma competição
 * Exemplos de código:
 * BSA = Brasileirão Série A
 * PL = Premier League
 * PD = La Liga
 * SA = Serie A
 * BL1 = Bundesliga
 */
export async function getTeamsByCompetition(
  competitionCode: string,
): Promise<FootballTeam[]> {
  const data = await request<CompetitionTeamsResponse>(
    `/competitions/${competitionCode}/teams`,
  );

  return data.teams ?? [];
}

/**
 * Busca um time pelo nome dentro de uma competição
 */
export async function findTeamByName(
  teamName: string,
  competitionCode = "BSA",
): Promise<FootballTeam | null> {
  const teams = await getTeamsByCompetition(competitionCode);
  const normalizedQuery = normalize(teamName);

  const exact =
    teams.find((team) => normalize(team.name) === normalizedQuery) ??
    teams.find((team) => normalize(team.shortName ?? "") === normalizedQuery) ??
    teams.find((team) => normalize(team.tla ?? "") === normalizedQuery);

  if (exact) return exact;

  const partial =
    teams.find((team) => normalize(team.name).includes(normalizedQuery)) ??
    teams.find((team) =>
      normalize(team.shortName ?? "").includes(normalizedQuery),
    );

  return partial ?? null;
}

/**
 * Busca detalhes completos de um time pelo nome:
 * 1. procura na competição
 * 2. pega o id encontrado
 * 3. retorna os detalhes completos
 */
export async function getTeamByName(
  teamName: string,
  competitionCode = "BSA",
): Promise<FootballTeam | null> {
  const team = await findTeamByName(teamName, competitionCode);

  if (!team) return null;

  return getTeamById(team.id);
}

/**
 * Retorna sugestões de nomes de times
 */
export async function searchTeams(
  query: string,
  competitionCode = "BSA",
): Promise<FootballTeam[]> {
  const teams = await getTeamsByCompetition(competitionCode);
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return teams.slice(0, 25);
  }

  return teams
    .filter((team) => {
      const name = normalize(team.name);
      const shortName = normalize(team.shortName ?? "");
      const tla = normalize(team.tla ?? "");

      return (
        name.includes(normalizedQuery) ||
        shortName.includes(normalizedQuery) ||
        tla.includes(normalizedQuery)
      );
    })
    .slice(0, 25);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function getLastTeamMatch(
  teamId: number,
): Promise<FootballMatch | null> {
  const data = await request<TeamMatchesResponse>(
    `/teams/${teamId}/matches?status=FINISHED&limit=1`,
  );

  return data.matches?.[0] ?? null;
}

export async function getNextTeamMatch(
  teamId: number,
): Promise<FootballMatch | null> {
  const data = await request<TeamMatchesResponse>(
    `/teams/${teamId}/matches?status=SCHEDULED&limit=1`,
  );

  return data.matches?.[0] ?? null;
}

export async function getTeamWithMatches(
  teamName: string,
  competitionCode = "BSA",
) {
  const team = await getTeamByName(teamName, competitionCode);

  if (!team) return null;

  const [lastMatch, nextMatch] = await Promise.all([
    getLastTeamMatch(team.id),
    getNextTeamMatch(team.id),
  ]);

  return {
    team,
    lastMatch,
    nextMatch,
  };
}
