import * as http from 'http';

interface TeamsResponse {
    teams: Team[];
}

interface Team {
    id: number,
    name: string;
}

interface ScoresResponse {
    scores: Score[]
}

interface Score {
    teamId: number,
    score: number;
}


async function fetchTeams(): Promise<TeamsResponse> {
    return fetch('http://localhost:3090/api/teams').then(res => res.json());
}

async function fetchScores(): Promise<ScoresResponse> {
    return fetch('http://localhost:3090/api/scores').then(res => res.json());
}

const server = http.createServer((req, res) => {
    switch (req.method) {
        case "GET": {
            switch (req.url) {
                case "/api/scores": {
                    fetchTeams().then((teamRes) => {
                        const teams: Map<number, Team> = new Map(teamRes.teams.map((team) => [team.id, team]));
                        fetchScores().then((scoresRes) => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            const response = {
                                scores: Array.from(scoresRes.scores).map((score) => {
                                    return {
                                        teamName: teams.get(score.teamId)?.name || "Missing",
                                        score: score.score
                                    };
                                }),
                            };
                            res.end(JSON.stringify(response));
                        }).catch(() => {
                            res.statusCode = 500;
                            res.end();
                        });
                    }).catch(() => {
                        res.statusCode = 500;
                        res.end();
                    });
                    break;
                }
                default: {
                    res.statusCode = 404;
                    res.statusMessage = `${req.url} Not found`;
                }
            }
            break;
        }
        default: {
            res.statusCode = 405;
            res.statusMessage = `${req.method} Not allowed`;
        }
    }
});

const port = process.env.PORT || 3080;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
