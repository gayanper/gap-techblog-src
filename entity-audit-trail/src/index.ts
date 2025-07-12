import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { fastify as Fastify } from "fastify";
import { readFileSync } from "fs";
import { applyMiddleware } from "graphql-middleware";
import pino from "pino";
import { buildCommands } from "./commands";
import { ContextMiddleware } from "./contextMiddleware";
import { buildRepositories } from "./repositories";
import { buildResolvers } from "./resolvers";

export type Context = {
  userId: string;
};

async function startServer() {
  const logger = pino({
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  });
  const typeDefs = readFileSync("./specs/api.graphql", { encoding: "utf-8" });
  const repositories = await buildRepositories();
  const commands = buildCommands(repositories);
  const resolvers = buildResolvers({
    repositories,
    commands,
  });

  const fastify = Fastify();
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const schemaWithMiddleware = applyMiddleware(
    executableSchema,
    ContextMiddleware
  );

  const server = new ApolloServer<Context>({
    formatError(formattedError, error) {
      logger.error(error);
      return formattedError;
    },
    plugins: [fastifyApolloDrainPlugin(fastify)],
    schema: schemaWithMiddleware,
  });
  await server.start();

  await fastify.register(fastifyApollo(server), {
    context: async (request) => {
      const userId = request.headers["x-user-id"] as string;
      return { userId };
    },
  });

  const port = 4000;
  await fastify.listen({ port });

  console.log(`🚀 Server ready at http://localhost:${port}`);

  process.on("SIGINT", async () => {
    await fastify.close();
    console.log("Server gracefully stopped");
    process.exit(0);
  });
}

startServer();
