import { spawnSync } from "child_process";

process.env = {
  ...process.env,
  NODE_ENV: "test",
  DATABASE_URL: "mysql://root:root@localhost:3337/audit_trail_test",
};
spawnSync("npx", ["prisma", "db", "push", "--force-reset"], {
  stdio: "inherit",
  env: process.env,
});
