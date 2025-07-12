import { ApolloServer } from "@apollo/server";
import assert from "assert";
import { randomUUID } from "crypto";
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

  async function createManager(): Promise<string> {
    const manager = await server.executeOperation(
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
            firstName: "Manager",
            lastName: "One",
            email: `manager.one.${randomUUID()}@example.com`,
            phoneNumber: "1234567890",
          },
        },
      },
      {
        contextValue: context,
      }
    );
    assert(manager.body.kind === "single");
    assert(manager.body.singleResult.data?.createEmployee !== undefined);
    const employee = manager.body.singleResult.data
      ?.createEmployee as graphql.Employee;
    assert(employee.id !== undefined);
    return employee.id;
  }

  describe("Mutation: Department", () => {
    it("should create an department", async () => {
      const managerId = await createManager();

      const result = await server.executeOperation(
        {
          query: `
          mutation CreateDepartment($input: NewDepartment!) {
            createDepartment(input: $input) {
              id
              name
              manager {
                id
                firstName
                lastName
              }
            }
          }
        `,
          variables: {
            input: {
              name: "Engineering",
              managerId: managerId,
            },
          },
        },
        {
          contextValue: context,
        }
      );

      assert(result.body.kind === "single");
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.createDepartment).toBeDefined();
      expect(result.body.singleResult.data?.createDepartment).toMatchObject({
        name: "Engineering",
        manager: {
          id: managerId,
          firstName: "Manager",
          lastName: "One",
        },
      });
    });

    it("should update an department", async () => {
      const managerId = await createManager();
      const result = await server.executeOperation(
        {
          query: `
          mutation CreateDepartment($input: NewDepartment!) {
            createDepartment(input: $input) {
              id
              name
              manager {
                id
              }
            }
          }
        `,
          variables: {
            input: {
              name: "Engineering",
              managerId: managerId,
            },
          },
        },
        {
          contextValue: context,
        }
      );

      assert(result.body.kind === "single");
      assert(result.body.singleResult.data?.createDepartment !== undefined);
      const department = result.body.singleResult.data
        ?.createDepartment as graphql.Department;
      const newManagerId = await createManager();

      const updateResult = await server.executeOperation(
        {
          query: `
          mutation UpdateDepartment($input: UpdateDepartment!) {
            updateDepartment(input: $input) {
              id
              name
              manager {
                id
              }
            }
          }
        `,
          variables: {
            input: {
              name: "Engineering ABC",
              managerId: newManagerId,
              id: department.id,
            },
          },
        },
        {
          contextValue: context,
        }
      );
      assert(updateResult.body.kind === "single");
      expect(updateResult.body.singleResult.errors).toBeUndefined();
      expect(
        updateResult.body.singleResult.data?.updateDepartment
      ).toBeDefined();

      const updatedDepartment = updateResult.body.singleResult.data
        ?.updateDepartment as graphql.Department;
      expect(updatedDepartment.manager.id).toBe(newManagerId);
      expect(updatedDepartment.name).toBe("Engineering ABC");
    });

    it("should delete an department", async () => {
      const managerId = await createManager();
      const resp = await server.executeOperation(
        {
          query: `
          mutation Create($input: NewDepartment!) {
            createDepartment(input: $input) {
              id
              name
              manager {
                id
              }
            }
          }
        `,
          variables: {
            input: {
              name: "Engineering",
              managerId: managerId,
            },
          },
        },
        {
          contextValue: context,
        }
      );
      assert(resp.body.kind === "single");
      const department = resp.body.singleResult.data
        ?.createDepartment as graphql.Department;

      const deleteResult = await server.executeOperation({
        query: `
          mutation Delete($id: ID!) {
            deleteDepartment(id: $id)
          }
        `,
        variables: {
          id: department.id,
        },
      });
      assert(deleteResult.body.kind === "single");
      expect(deleteResult.body.singleResult.errors).toBeUndefined();
      expect(
        deleteResult.body.singleResult.data?.deleteDepartment
      ).toBeDefined();
      expect(deleteResult.body.singleResult.data?.deleteDepartment).toBe(true);
    });
  });

  describe("Query Department", () => {
    it("should get a department by ID", async () => {
      const managerId = await createManager();
      const createResult = await server.executeOperation(
        {
          query: `
          mutation CreateDepartment($input: NewDepartment!) {
            createDepartment(input: $input) {
              id
              name
              manager {
                id
                firstName
                lastName
              }
            }
          }
        `,
          variables: {
            input: {
              name: "Engineering",
              managerId: managerId,
            },
          },
        },
        {
          contextValue: context,
        }
      );

      assert(createResult.body.kind === "single");
      expect(createResult.body.singleResult.errors).toBeUndefined();
      const department = createResult.body.singleResult.data
        ?.createDepartment as graphql.Department;

      const queryResult = await server.executeOperation(
        {
          query: `
          query GetDepartment($id: ID!) {
            department(id: $id) {
              id
              name
              manager {
                id
                firstName
                lastName
              }
            }
          }
        `,
          variables: {
            id: department.id,
          },
        },
        {
          contextValue: context,
        }
      );

      assert(queryResult.body.kind === "single");
      expect(queryResult.body.singleResult.errors).toBeUndefined();
      expect(queryResult.body.singleResult.data?.department).toBeDefined();
      expect(queryResult.body.singleResult.data?.department).toMatchObject({
        id: department.id,
        name: "Engineering",
        manager: {
          id: managerId,
          firstName: "Manager",
          lastName: "One",
        },
      });
    });

    it("should get all departments", async () => {
      const queryResult = await server.executeOperation(
        {
          query: `
          query GetDepartments {
            departments {
              id
              name
              manager {
                id
                firstName
                lastName
              }
            }
          }
        `,
        },
        {
          contextValue: context,
        }
      );

      assert(queryResult.body.kind === "single");
      expect(queryResult.body.singleResult.errors).toBeUndefined();
      expect(queryResult.body.singleResult.data?.departments).toBeDefined();

      assert(Array.isArray(queryResult.body.singleResult.data?.departments));
      expect(
        queryResult.body.singleResult.data?.departments.length
      ).toBeGreaterThan(0);
    });
  });
});
