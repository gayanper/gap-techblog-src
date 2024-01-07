const Verifier = require("@pact-foundation/pact").Verifier;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { providerName, pactFile, provider } = require("../pact.js");
chai.use(chaiAsPromised);
let port = 8080;
let opts;

describe("Pact Verification", () => {
  before(async () => {
    opts = {
      provider: providerName,
      providerBaseUrl: `http://127.0.0.1:${port}`,
      pactUrls: [pactFile],
    };
    // start the server
  });

  after(() => {
    // send sigterm to server
  });
  it("should validate the expectations of cart", () => {
    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log("Pact Verification Complete!");
        console.log(output);
      })
      .catch((e) => {
        console.error("Pact verification failed :(", e);
      });
  });
});
