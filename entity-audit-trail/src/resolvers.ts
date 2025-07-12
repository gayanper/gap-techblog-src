import type { Context } from ".";
import { Commands } from "./commands";
import type { JsonPathOperation } from "./generated/graphql";
import * as graphql from "./generated/graphql";
import { Assignment } from "./models/Assignment";
import { Department } from "./models/Department";
import type { Employee } from "./models/Employee";
import type {
  Action,
  EntityHistory,
  EntityType,
  JsonPatch,
  JsonPatchOperation,
  Snapshot,
} from "./models/EntityHistory";
import { Repositories } from "./repositories";

export function buildResolvers(dependencies: {
  repositories: Repositories;
  commands: Commands;
}): graphql.Resolvers<Context> {
  return {
    Query: {
      employees: () =>
        dependencies.repositories.employeeRepository
          .findAll()
          .then((employees) => employees.map(mapEmployeeToGraphQL)),
      employee: (_, { id }, context) =>
        dependencies.repositories.employeeRepository
          .get(parseInt(id))
          .then(mapEmployeeToGraphQL),
      departments: () =>
        dependencies.repositories.departmentRepository
          .findAll()
          .then((departments) => departments.map(mapDepartmentToGraphQL)),
      department: (_, { id }, context) =>
        dependencies.repositories.departmentRepository
          .get(parseInt(id))
          .then(mapDepartmentToGraphQL),
      assignment: (_, { id }, context) =>
        dependencies.repositories.assignmentRepository
          .get(parseInt(id))
          .then(mapAssignmentToGraphQL),
      history: (_, { entityId, entityType }, context) =>
        dependencies.repositories.entityHistoryRepository
          .findEntityHistory(
            mapEntityTypeFromGraphQL(entityType),
            parseInt(entityId)
          )
          .then(mapEntityHistoryToGraphQL),
    },
    Mutation: {
      createEmployee: async (_, { input }, context) => {
        const value = await dependencies.repositories.employeeRepository.create(
          {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phoneNumber: input.phoneNumber,
          }
        );
        return mapEmployeeToGraphQL(value);
      },
      updateEmployee: async (_, { input }, context) => {
        const value = await dependencies.repositories.employeeRepository.update(
          parseInt(input.id),
          {
            firstName: input.firstName ?? undefined,
            lastName: input.lastName ?? undefined,
            email: input.email ?? undefined,
            phoneNumber: input.phoneNumber ?? undefined,
          }
        );
        return mapEmployeeToGraphQL(value);
      },
      deleteEmployee: async (_, { id }, context) => {
        await dependencies.repositories.employeeRepository.delete(parseInt(id));
        return true;
      },
      createDepartment: async (_, { input }, context) => {
        const value = await dependencies.commands.createDepartment.execute({
          name: input.name,
          managerId: parseInt(input.managerId),
        });
        return mapDepartmentToGraphQL(value.department);
      },
      updateDepartment: async (_, { input }, context) => {
        const value = await dependencies.commands.updateDepartment.execute({
          id: parseInt(input.id),
          name: input.name,
          managerId: parseInt(input.managerId),
        });
        return mapDepartmentToGraphQL(value.department);
      },
      deleteDepartment: async (_, { id }, context) => {
        return dependencies.repositories.departmentRepository.delete(
          parseInt(id)
        );
      },
      assignEmployee: async (_, { input }, context) => {
        const value = await dependencies.commands.assignEmployee.execute({
          departmentId: parseInt(input.departmentId),
          employeeId: parseInt(input.employeeId),
        });
        return mapAssignmentResponseToGraphQL(value);
      },
      endEmployeeAssignment: async (_, { input }, context) => {
        const value = await dependencies.commands.endEmployeeAssignment.execute(
          {
            assignmentId: parseInt(input.id),
            endDate: input.endDate ? new Date(input.endDate) : undefined,
          }
        );
        return mapAssignmentToGraphQL(value.assignment);
      },
    },
  };
}

function mapEmployeeToGraphQL(value: Employee): graphql.Employee {
  return {
    email: value.email,
    firstName: value.firstName,
    lastName: value.lastName,
    phoneNumber: value.phoneNumber,
    id: value.id.toString(),
  };
}
function mapDepartmentToGraphQL(value: Department): graphql.Department {
  return {
    id: value.id.toString(),
    name: value.name,
    manager: mapEmployeeToGraphQL(value.manager),
  };
}

function mapAssignmentResponseToGraphQL(value: {
  assignment: Assignment;
  previousAssignment?: Assignment;
}): graphql.AssignEmployeeResponse {
  return {
    assignment: mapAssignmentToGraphQL(value.assignment),
    previousAssignment: value.previousAssignment
      ? mapAssignmentToGraphQL(value.previousAssignment)
      : null,
  };
}

function mapAssignmentToGraphQL(value: Assignment): graphql.Assignment {
  return {
    id: value.id.toString(),
    employee: mapEmployeeToGraphQL(value.employee),
    department: mapDepartmentToGraphQL(value.department),
    startDate: value.startDate.toLocaleString(),
    endDate: value.endDate ? value.endDate.toLocaleString() : null,
  };
}

function mapEntityTypeFromGraphQL(value: graphql.EntityType): EntityType {
  switch (value) {
    case graphql.EntityType.Assignment: {
      return "assignment";
    }
    case graphql.EntityType.Department: {
      return "department";
    }
    case graphql.EntityType.Employee: {
      return "employee";
    }
  }
}

function mapEntityHistoryToGraphQL(
  value: EntityHistory[]
): graphql.EntityHistory[] {
  return value.map((history) => ({
    id: history.id.toString(),
    action: mapActionToGraphQL(history.action),
    changedBy: history.changedBy,
    changedAt: history.changedAt.toISOString(),
    entityId: history.entityId.toString(),
    entityType: mapEntityTypeToGraphQL(history.entityType),
    diffsJsonString: mapJsonPatchToGraphQL(history.diffs),
    snapshotJsonString: mapSnapshotToGraphQL(history.snapshot),
  }));
}

function mapJsonPatchToGraphQL(value: JsonPatch[]): string {
  return JSON.stringify(value);
}

function mapActionToGraphQL(action: Action): graphql.EntityAction {
  switch (action) {
    case "created":
      return graphql.EntityAction.Created;
    case "changed":
      return graphql.EntityAction.Changed;
    case "deleted":
      return graphql.EntityAction.Deleted;
  }
}

function mapEntityTypeToGraphQL(entityType: EntityType): graphql.EntityType {
  switch (entityType) {
    case "employee":
      return graphql.EntityType.Employee;
    case "department":
      return graphql.EntityType.Department;
    case "assignment":
      return graphql.EntityType.Assignment;
  }
}

function mapSnapshotToGraphQL(snapshot: Snapshot): string {
  return JSON.stringify(snapshot);
}
