const PANDASCORE_BASE_URL = "https://api.pandascore.co";
function getToken() {
    const token = process.env.PANDASCORE_TOKEN;
    if (!token)
        throw new Error("PANDASCORE_TOKEN não definido.");
    return token;
}
function getGamePath(game) {
    switch (game) {
        case "lol":
            return "lol";
        case "cs":
            return "csgo";
        case "rl":
            return "rl";
    }
}
function normalize(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}
export async function searchEsportsTeams({ game, search, page = 1, perPage = 25, }) {
    const token = getToken();
    const gamePath = getGamePath(game);
    const query = normalize(search);
    const url = new URL(`${PANDASCORE_BASE_URL}/${gamePath}/teams`);
    url.searchParams.set("token", token);
    url.searchParams.set("page", String(page));
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("search[name]", search);
    const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar times: ${response.status} ${response.statusText} - ${errorText}`);
    }
    let data = (await response.json());
    if (!data.length) {
        const fallbackUrl = new URL(`${PANDASCORE_BASE_URL}/${gamePath}/teams`);
        fallbackUrl.searchParams.set("token", token);
        fallbackUrl.searchParams.set("page", "1");
        fallbackUrl.searchParams.set("per_page", "100");
        const fallbackResponse = await fetch(fallbackUrl.toString(), {
            headers: { Accept: "application/json" },
        });
        if (!fallbackResponse.ok) {
            const errorText = await fallbackResponse.text();
            throw new Error(`Erro no fallback de times: ${fallbackResponse.status} ${fallbackResponse.statusText} - ${errorText}`);
        }
        const fallbackData = (await fallbackResponse.json());
        data = fallbackData.filter((team) => {
            const teamName = normalize(team.name);
            const acronym = normalize(team.acronym ?? "");
            const slug = normalize(team.slug ?? "");
            return (teamName.includes(query) ||
                acronym.includes(query) ||
                slug.includes(query));
        });
    }
    return data.slice(0, perPage);
}
export async function getEsportsTeamById(game, teamId) {
    const token = getToken();
    const url = new URL(`${PANDASCORE_BASE_URL}/teams/${teamId}`);
    url.searchParams.set("token", token);
    const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar time de esports: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const team = (await response.json());
    return team;
}
export async function getTeamMatches(teamId) {
    const token = getToken();
    const url = new URL(`${PANDASCORE_BASE_URL}/teams/${teamId}/matches`);
    url.searchParams.set("token", token);
    url.searchParams.set("page", "1");
    url.searchParams.set("per_page", "20");
    url.searchParams.set("sort", "-begin_at");
    const response = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar partidas do time: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return (await response.json());
}
//# sourceMappingURL=esports_data.service.js.map