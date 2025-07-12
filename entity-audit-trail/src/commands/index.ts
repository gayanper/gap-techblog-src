import type { AssignmentRepository } from "../repositories/AssignmentRepository";
import { DepartmentRepository } from "../repositories/DepartmentRepository";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import type { EntityHistoryRepository } from "../repositories/EntityHistoryRepository";
import { buildAssignEmployeeCommand } from "./assignEmployee";
import { buildCreateDepartmentCommand } from "./createDepartment";
import { buildEndEmployeeAssignmentCommand } from "./endEmployeeAssignment";
import { buildFindEntityHistoryCommand } from "./findEntityHistory";
import { buildUpdateDepartmentCommand } from "./updateDepartment";

export interface Command<Input, Out> {
  execute(input: Input): Promise<Out>;
}

export type Commands = ReturnType<typeof buildCommands>;

export function buildCommands(dependencies: {
  employeeRepository: EmployeeRepository;
  assignmentRepository: AssignmentRepository;
  departmentRepository: DepartmentRepository;
  entityHistoryRepository: EntityHistoryRepository;
}) {
  return {
    assignEmployee: buildAssignEmployeeCommand(dependencies),
    endEmployeeAssignment: buildEndEmployeeAssignmentCommand(dependencies),
    createDepartment: buildCreateDepartmentCommand(dependencies),
    updateDepartment: buildUpdateDepartmentCommand(dependencies),
    findEntityHistory: buildFindEntityHistoryCommand(dependencies),
  };
}
