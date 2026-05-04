const BASE_URL = "https://api.football-data.org/v4";
const API_TOKEN = process.env.FOOTBALL_DATA_TOKEN;
if (!API_TOKEN) {
    throw new Error("FOOTBALL_DATA_TOKEN não foi definido no ambiente.");
}
async function request(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
            "X-Auth-Token": API_TOKEN,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`football-data error ${response.status}: ${text || "sem detalhes"}`);
    }
    return response.json();
}
/**
 * Busca os dados completos de um time por ID
 */
export async function getTeamById(teamId) {
    return request(`/teams/${teamId}`);
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
export async function getTeamsByCompetition(competitionCode) {
    const data = await request(`/competitions/${competitionCode}/teams`);
    return data.teams ?? [];
}
/**
 * Busca um time pelo nome dentro de uma competição
 */
export async function findTeamByName(teamName, competitionCode = "BSA") {
    const teams = await getTeamsByCompetition(competitionCode);
    const normalizedQuery = normalize(teamName);
    const exact = teams.find((team) => normalize(team.name) === normalizedQuery) ??
        teams.find((team) => normalize(team.shortName ?? "") === normalizedQuery) ??
        teams.find((team) => normalize(team.tla ?? "") === normalizedQuery);
    if (exact)
        return exact;
    const partial = teams.find((team) => normalize(team.name).includes(normalizedQuery)) ??
        teams.find((team) => normalize(team.shortName ?? "").includes(normalizedQuery));
    return partial ?? null;
}
/**
 * Busca detalhes completos de um time pelo nome:
 * 1. procura na competição
 * 2. pega o id encontrado
 * 3. retorna os detalhes completos
 */
export async function getTeamByName(teamName, competitionCode = "BSA") {
    const team = await findTeamByName(teamName, competitionCode);
    if (!team)
        return null;
    return getTeamById(team.id);
}
/**
 * Retorna sugestões de nomes de times
 */
export async function searchTeams(query, competitionCode = "BSA") {
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
        return (name.includes(normalizedQuery) ||
            shortName.includes(normalizedQuery) ||
            tla.includes(normalizedQuery));
    })
        .slice(0, 25);
}
function normalize(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}
export async function getLastTeamMatch(teamId) {
    const data = await request(`/teams/${teamId}/matches?status=FINISHED&limit=1`);
    return data.matches?.[0] ?? null;
}
export async function getNextTeamMatch(teamId) {
    const data = await request(`/teams/${teamId}/matches?status=SCHEDULED&limit=1`);
    return data.matches?.[0] ?? null;
}
export async function getTeamWithMatches(teamName, competitionCode = "BSA") {
    const team = await getTeamByName(teamName, competitionCode);
    if (!team)
        return null;
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
//# sourceMappingURL=football_data.service.js.map