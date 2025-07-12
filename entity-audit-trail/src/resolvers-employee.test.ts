import { ApolloServer } from "@apollo/server";
import assert from "assert";
import { readFileSync } from "fs";
import * as path from "path";
import type { Context } from ".";
import { buildCommands } from "./commands";
import * as graphql from "./generated/graphql";
import { buildRepositories, type Repositories } from "./repositories";
import { buildResolvers } from "./resolvers";

describe("Integration: GraphQL Resolvers", () => {
  const typeDefs = readFileSync(
    path.join(__dirname, "../specs/api.graphql"),
    "utf-8"
  );

  const context: Context = {
    userId: "admin",
  };

  let server: ApolloServer<Context>;
  let repositories: Repositories;

  beforeAll(async () => {
    repositories = await buildRepositories();
    const commands = buildCommands(repositories);
    const resolvers = buildResolvers({ repositories, commands });
    server = new ApolloServer<Context>({ typeDefs, resolvers });
  });

  afterAll(async () => {
    await server.stop();
    await repositories.$prisma.$disconnect();
  });

  describe("Mutation: Employees", () => {
    it("should create an employee", async () => {
      const result = await server.executeOperation(
        {
          query: `
          mutation CreateEmployee($input: NewEmployee!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
              email
              phoneNumber
            }
          }
        `,
          variables: {
            input: {
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phoneNumber: "1234567890",
            },
          },
        },
        {
          contextValue: context,
        }
      );

      assert(result.body.kind === "single");
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.createEmployee).toBeDefined();
      expect(result.body.singleResult.data?.createEmployee).toMatchObject({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phoneNumber: "1234567890",
        id: expect.any(String),
      } as graphql.Employee);
    });

    it("should update an employee", async () => {
      // First, create an employee to update
      const resp = await server.executeOperation(
        {
          query: `
          mutation CreateEmployee($input: NewEmployee!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
            }
          }
        `,
          variables: {
            input: {
              firstName: "Jane",
              lastName: "Smith",
              email: "jane@example.com",
              phoneNumber: "0987654321",
            },
          },
        },
        {
          contextValue: context,
        }
      );
      assert(resp.body.kind === "single");
      expect(resp.body.singleResult.errors).toBeUndefined();
      const employee = resp.body.singleResult.data
        ?.createEmployee as graphql.Employee;
      assert(employee?.id !== undefined);

      const updateResult = await server.executeOperation(
        {
          query: `
          mutation UpdateEmployee($input: UpdateEmployee!) {
            updateEmployee(input: $input) {
              id
              firstName
              lastName
            }
          }
        `,
          variables: {
            input: {
              firstName: "Jane",
              lastName: "Doe",
              id: employee.id,
            },
          },
        },
        { contextValue: context }
      );
    });

    it("should delete an employee", async () => {
      // First, create an employee to delete
      const resp = await server.executeOperation(
        {
          query: `
          mutation CreateEmployee($input: NewEmployee!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
            }
          }
        `,
          variables: {
            input: {
              firstName: "Mark",
              lastName: "Johnson",
              email: "mark@example.com",
              phoneNumber: "1122334455",
            },
          },
        },
        {
          contextValue: context,
        }
      );
      assert(resp.body.kind === "single");
      expect(resp.body.singleResult.errors).toBeUndefined();
      const employee = resp.body.singleResult.data
        ?.createEmployee as graphql.Employee;
      assert(employee?.id !== undefined);
      const deleteResult = await server.executeOperation(
        {
          query: `
          mutation DeleteEmployee($id: ID!) {
            deleteEmployee(id: $id)
          }
        `,
          variables: {
            id: employee.id,
          },
        },
        {
          contextValue: context,
        }
      );
      assert(deleteResult.body.kind === "single");
      expect(deleteResult.body.singleResult.errors).toBeUndefined();
      expect(deleteResult.body.singleResult.data?.deleteEmployee).toBeDefined();
      expect(deleteResult.body.singleResult.data?.deleteEmployee).toBe(true);
    });
  });

  describe("Query: Employees", () => {
    it("should fetch all employees", async () => {
      const resp = await server.executeOperation(
        {
          query: `
          mutation CreateEmployee($input: NewEmployee!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
            }
          }
        `,
          variables: {
            input: {
              firstName: "Robert",
              lastName: "Wonderland",
              email: "robert@example.com",
              phoneNumber: "1231231234",
            },
          },
        },
        {
          contextValue: context,
        }
      );

      const result = await server.executeOperation(
        {
          query: `
          query GetEmployees {
            employees {
              id
              firstName
              lastName
            }
          }
        `,
        },
        { contextValue: context }
      );

      assert(result.body.kind === "single");
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.employees).toBeDefined();
      assert(Array.isArray(result.body.singleResult.data?.employees));
      expect(result.body.singleResult.data?.employees.length).toBeGreaterThan(
        0
      );
    });

    it("should fetch an employee by ID", async () => {
      const resp = await server.executeOperation(
        {
          query: `
          mutation CreateEmployee($input: NewEmployee!) {
            createEmployee(input: $input) {
              id
              firstName
              lastName
            }
          }
        `,
          variables: {
            input: {
              firstName: "Alice",
              lastName: "Wonderland",
              email: "alice@example.com",
              phoneNumber: "1231231234",
            },
          },
        },
        {
          contextValue: context,
        }
      );
      assert(resp.body.kind === "single");
      expect(resp.body.singleResult.errors).toBeUndefined();

      const employee = resp.body.singleResult.data
        ?.createEmployee as graphql.Employee;
      assert(employee?.id !== undefined);
      const result = await server.executeOperation(
        {
          query: `
          query GetEmployee($id: ID!) {
            employee(id: $id) {
              id
              firstName
              lastName
            }
          }
        `,
          variables: {
            id: employee.id,
          },
        },
        { contextValue: context }
      );
      assert(result.body.kind === "single");
      expect(result.body.singleResult.errors).toBeUndefined();
      assert(result.body.singleResult.data?.employee !== undefined);

      const fetchedEmployee = result.body.singleResult.data
        ?.employee as graphql.Employee;
      expect(fetchedEmployee).toEqual({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
      });
    });
  });
});
