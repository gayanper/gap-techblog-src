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
import { ContextManager } from "./contextMiddleware";

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

  async function createEmployee(): Promise<graphql.Employee> {
    const lastName = randomUUID();
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
            firstName: "Jon",
            lastName: lastName,
            email: `jon.${lastName}@example.com`,
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
    return employee;
  }

  async function createDepartment(): Promise<graphql.Department> {
    const manager = await server.executeOperation(
      {
        query: `
        mutation CreateEmployee($input: NewEmployee!) {
          createEmployee(input: $input) {
            id
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

    const department = await server.executeOperation(
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
            managerId: employee.id,
          },
        },
      },
      {
        contextValue: context,
      }
    );

    assert(department.body.kind === "single");
    assert(department.body.singleResult.data?.createDepartment !== undefined);
    return department.body.singleResult.data
      ?.createDepartment as graphql.Department;
  }

  it("should assign an employee to a department", async () => {
    const employee = await createEmployee();
    const department = await createDepartment();

    const result = await server.executeOperation(
      {
        query: `
        mutation NewAssignment($input: NewAssignment!) {
          assignEmployee(input: $input) {
            assignment {
              id
              employee {
                id
                firstName
                lastName
              }
              department {
                id
                name
              }
            }
          }
        }
      `,
        variables: {
          input: {
            employeeId: employee.id,
            departmentId: department.id,
          },
        },
      },
      {
        contextValue: context,
      }
    );

    assert(result.body.kind === "single");
    expect(result.body.singleResult.errors).toBeUndefined();

    assert(result.body.singleResult.data?.assignEmployee !== undefined);
    const assignment = result.body.singleResult.data
      ?.assignEmployee as graphql.AssignEmployeeResponse;

    expect(assignment.assignment.employee.id).toBe(employee.id);
    expect(assignment.assignment.department.id).toBe(department.id);
  });

  it("should end assignment when an employee is assigned to a new department", async () => {
    const employee = await createEmployee();
    const department1 = await createDepartment();
    const department2 = await createDepartment();

    const firstAssignment = await server.executeOperation(
      {
        query: `
        mutation NewAssignment($input: NewAssignment!) {
          assignEmployee(input: $input) {
            assignment {
              id
              employee {
                id
                firstName
                lastName
              }
              department {
                id
                name
              }
            }
          }
        }
      `,
        variables: {
          input: {
            employeeId: employee.id,
            departmentId: department1.id,
          },
        },
      },
      {
        contextValue: context,
      }
    );

    assert(firstAssignment.body.kind === "single");
    assert(
      firstAssignment.body.singleResult.data?.assignEmployee !== undefined
    );

    const secondAssignment = await server.executeOperation(
      {
        query: `
        mutation NewAssignment($input: NewAssignment!) {
          assignEmployee(input: $input) {
            assignment {
              id
              employee {
                id
                firstName
                lastName
              }
              department {
                id
                name
              }
            }
            previousAssignment {
              id
              endDate
              employee {
                id
              }
              department {
                id
              }
            }
          }
        }
      `,
        variables: {
          input: {
            employeeId: employee.id,
            departmentId: department2.id,
          },
        },
      },
      {
        contextValue: context,
      }
    );

    assert(secondAssignment.body.kind === "single");
    expect(secondAssignment.body.singleResult.errors).toBeUndefined();

    assert(
      secondAssignment.body.singleResult.data?.assignEmployee !== undefined
    );
    const assignmentResponse = secondAssignment.body.singleResult.data
      ?.assignEmployee as graphql.AssignEmployeeResponse;

    expect(assignmentResponse.assignment.employee.id).toBe(employee.id);
    expect(assignmentResponse.assignment.department.id).toBe(department2.id);

    expect(assignmentResponse.previousAssignment).toBeDefined();
    expect(assignmentResponse.previousAssignment?.employee.id).toBe(
      employee.id
    );
    expect(assignmentResponse.previousAssignment?.department.id).toBe(
      department1.id
    );
    expect(assignmentResponse.previousAssignment?.endDate).not.toBeNull();
  });

  it("should end an assignment", async () => {
    const employee = await createEmployee();
    const department = await createDepartment();

    const assignment = await server.executeOperation(
      {
        query: `
        mutation NewAssignment($input: NewAssignment!) {
          assignEmployee(input: $input) {
            assignment {
              id
              employee {
                id
              }
              department {
                id
              }
            }
          }
        }
      `,
        variables: {
          input: {
            employeeId: employee.id,
            departmentId: department.id,
          },
        },
      },
      {
        contextValue: context,
      }
    );

    assert(assignment.body.kind === "single");
    expect(assignment.body.singleResult.errors).toBeUndefined();

    assert(assignment.body.singleResult.data?.assignEmployee !== undefined);
    const createdAssignment = assignment.body.singleResult.data
      ?.assignEmployee as graphql.AssignEmployeeResponse;

    const endAssignment = await server.executeOperation(
      {
        query: `
        mutation EndAssignment($input: EndAssignment!) {
          endEmployeeAssignment(input: $input) {
            id
            endDate
          }
        }
      `,
        variables: {
          input: {
            id: createdAssignment.assignment.id,
            endDate: new Date().toISOString(),
          },
        },
      },
      {
        contextValue: context,
      }
    );

    assert(endAssignment.body.kind === "single");
    assert(
      endAssignment.body.singleResult.data?.endEmployeeAssignment !== undefined
    );
    const endedAssignment = endAssignment.body.singleResult.data
      ?.endEmployeeAssignment as graphql.Assignment;

    expect(endedAssignment.endDate).not.toBeNull();
  });
});
