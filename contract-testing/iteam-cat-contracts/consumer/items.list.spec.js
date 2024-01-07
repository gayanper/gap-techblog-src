// Setting up our test framework
const chai = require("chai");
const request = require("superagent");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const proc = require("child_process");
chai.use(chaiAsPromised);

// We need Pact in order to use it in our test
const { provider } = require("../pact.js");
const { eachLike } = require("@pact-foundation/pact").MatchersV3;

describe("Pact with Item Catalog Service", () => {
  describe("given there are items", () => {
    const itemProperties = {
      code: "T9000",
      description: "Milk 3.5% 1L",
      price: "10.5",
    };

    describe("when a call to the API is made", () => {
      before(() => {
        provider
          .given("there are items")
          .uponReceiving("a request to list all items")
          .withRequest({
            method: "GET",
            path: "/items",
          })
          .willRespondWith({
            body: eachLike(itemProperties),
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
      });

      it("will receive the list of items", () => {
        return provider.executeTest((mockserver) => {
          fetchItems(mockserver.port);
        });
      });

      function fetchItems(port) {
        proc.execSync(`../price-list-cli/bin/price-list-cli -port ${port}`);
      }
    });
  });
});
