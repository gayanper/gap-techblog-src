import type { Command } from ".";
import type { Assignment } from "../models/Assignment";
import type { AssignmentRepository } from "../repositories/AssignmentRepository";
import type { DepartmentRepository } from "../repositories/DepartmentRepository";
import type { EmployeeRepository } from "../repositories/EmployeeRepository";

type Input = {
  employeeId: number;
  departmentId: number;
};

type Output = {
  assignment: Assignment;
  previousAssignment?: Assignment;
};

export function buildAssignEmployeeCommand(dependencies: {
  assignmentRepository: AssignmentRepository;
  employeeRepository: EmployeeRepository;
  departmentRepository: DepartmentRepository;
}): Command<Input, Output> {
  return {
    async execute(input) {
      const employee = await dependencies.employeeRepository.get(
        input.employeeId
      );
      const department = await dependencies.departmentRepository.get(
        input.departmentId
      );

      if (!employee) {
        throw new Error(`Employee with ID ${input.employeeId} not found`);
      }
      if (!department) {
        throw new Error(`Department with ID ${input.departmentId} not found`);
      }

      // if a assignment already exists, then end it
      const existingAssignments =
        await dependencies.assignmentRepository.findByEmployeeWithNoEndDate(
          input.employeeId
        );
      if (existingAssignments.length > 1) {
        throw new Error(
          `Employee with ID ${input.employeeId} already has multiple active assignments`
        );
      }

      let previousAssignment: Assignment | undefined;
      if (existingAssignments.length === 1) {
        previousAssignment = await dependencies.assignmentRepository.update(
          existingAssignments[0].id,
          {
            endDate: new Date(),
          }
        );
      }

      const assignment = await dependencies.assignmentRepository.create({
        employee,
        department,
        startDate: new Date(),
      });

      if (previousAssignment) {
        return { assignment, previousAssignment };
      } else {
        return { assignment };
      }
    },
  };
}
