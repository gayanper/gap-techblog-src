import type { Command } from ".";
import type { Assignment } from "../models/Assignment";
import { AssignmentRepository } from "../repositories/AssignmentRepository";
import type { EmployeeRepository } from "../repositories/EmployeeRepository";

type Input = {
  assignmentId: number;
  endDate?: Date;
};

type Output = {
  assignment: Assignment;
};

export function buildEndEmployeeAssignmentCommand(dependencies: {
  assignmentRepository: AssignmentRepository;
  employeeRepository: EmployeeRepository;
}): Command<Input, Output> {
  return {
    async execute({ assignmentId, endDate }) {
      const assignment = await dependencies.assignmentRepository.get(
        assignmentId
      );
      if (!assignment) {
        throw new Error(`Assignment not found for id ${assignmentId}`);
      }

      const updatedValue = await dependencies.assignmentRepository.update(
        assignment.id,
        {
          endDate: endDate ?? new Date(),
        }
      );

      return { assignment: updatedValue };
    },
  };
}
