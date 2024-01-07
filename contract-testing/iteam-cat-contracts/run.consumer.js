(async () => {
  const { runTests } = require("./run.spec.js");
  await runTests("consumer");
})();
