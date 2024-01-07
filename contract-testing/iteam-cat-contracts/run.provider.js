// Let's use async/await
(async () => {
  const { runTests } = require("./run.spec.js");
  await runTests("provider");
})();
