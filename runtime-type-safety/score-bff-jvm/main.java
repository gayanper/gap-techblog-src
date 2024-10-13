//DEPS io.helidon.webserver:helidon-webserver:4.1.2
//DEPS io.helidon.webclient:helidon-webclient-api:4.1.2
//DEPS io.helidon.webclient:helidon-webclient-http2:4.1.2
//DEPS io.helidon.http.media:helidon-http-media-jsonb:4.1.2
//COMPILE_OPTIONS --enable-preview

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import io.helidon.common.media.type.ParserMode;
import io.helidon.http.HeaderNames;
import io.helidon.webclient.api.WebClient;
import io.helidon.webclient.api.WebClientConfig;
import io.helidon.webserver.WebServer;

public record Team(Long id, String name) {
}

public record TeamsResponse(List<Team> teams) {
}

public record Score(Long teamId, Long score) {
}

public record ScoresResponse(List<Score> scores) {
}

public record TeamScore(String teamName, Long score) {
}

public record TeamScoresResponse(List<TeamScore> scores) {
}

TeamsResponse fetchTeams() {
    return WebClient.create(WebClientConfig.builder().mediaTypeParserMode(ParserMode.STRICT).buildPrototype()).get(
            "http://localhost:3090/api/teams").request(TeamsResponse.class).entity();
}

ScoresResponse fetchScores() {
    return WebClient.create(WebClientConfig.builder().mediaTypeParserMode(ParserMode.STRICT).buildPrototype()).get(
            "http://localhost:3090/api/scores").request(ScoresResponse.class).entity();
}

void main() {
    WebServer.builder().port(3080).routing(it -> {
        it.get("/api/scores", (req, res) -> {
            var teams = fetchTeams().teams().stream().collect(Collectors.toMap(Team::id, Function.identity()));
            var teamScores = fetchScores().scores().stream().map(s -> new TeamScore(
                    Optional.ofNullable(teams.get(s.teamId)).map(Team::name).orElse("Missing"), s.score)).toList();
            res.header(HeaderNames.CONTENT_TYPE, "application/json");
            res.send(new TeamScoresResponse(teamScores));
        });
    }).build().start();
}