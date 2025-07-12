"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
  overwrite: true,
  schema: "./specs/api.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};
exports.default = config;
//# sourceMappingURL=codegen.js.map
