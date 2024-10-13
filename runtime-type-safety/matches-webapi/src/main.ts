import * as http from 'http';

const server = http.createServer((req, res) => {

  switch (req.method) {
    case "GET": {
      switch (req.url) {
        case "/api/teams": {
          const teamNames = Array.from(["New England Patriots", "Dallas Cowboys", "Green Bay Packers", "Pittsburgh Steelers", "Chicago Bears"]);
          const teamData = teamNames.map((value, index) => {
            return {
              "id": `${index}A`,
              //"id": index,
              "name": value
            }
          });
          const data = JSON.stringify({
            "teams": teamData
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
          break;
        }
        case "/api/scores": {
          const scores = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
          const scoreData = scores.map((value, index) => {
            return {
              "teamId": index,
              "score": value
            }
          });
          const data = JSON.stringify({
            "scores": scoreData
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
          break;
        }
        default: {
          res.statusCode = 404;
          res.statusMessage = `${req.url} Not found`;
          res.end();
        }
      }
      break;
    }
    default: {
      res.statusCode = 405;
      res.statusMessage = `${req.method} Not allowed`;
      res.end();
    }
  }
});

const port = process.env.PORT || 3090;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
