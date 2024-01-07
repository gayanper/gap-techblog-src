const pact = require("@pact-foundation/pact");
const config = require("./pact-config.json");

const Pact = pact.PactV3;
const path = require("path");
const process = require("process");
const consumerName = config.consumerName;
const providerName = config.providerName;
const pactFile = path.resolve(`./pacts/${consumerName}-${providerName}.json`);

module.exports = {
  pactFile,
};

const provider = new Pact({
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "info",
  host: "127.0.0.1",
  consumer: consumerName,
  provider: providerName,
  host: "127.0.0.1",
});

process.on("SIGINT", () => {
  pact.removeAllServers();
});

module.exports = {
  provider,
  pactFile,
  consumerName,
  providerName,
  consumerVersion: "1.0.0",
};
