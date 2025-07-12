import type { DepartmentRepository } from "../repositories/DepartmentRepository";
import type { EmployeeRepository } from "../repositories/EmployeeRepository";
import type { Command } from ".";
import type { Department } from "../models/Department";

type Input = {
  id: number;
  name: string;
  managerId: number;
};

type Output = {
  department: Department;
};

export function buildUpdateDepartmentCommand(dependencies: {
  departmentRepository: DepartmentRepository;
  employeeRepository: EmployeeRepository;
}): Command<Input, Output> {
  return {
    async execute(input) {
      const existingDepartment = await dependencies.departmentRepository.get(
        input.id
      );
      if (!existingDepartment) {
        throw new Error(`Department not found for id ${input.id}`);
      }

      const manager = await dependencies.employeeRepository.get(
        input.managerId
      );
      if (!manager) {
        throw new Error(`Manager not found for id ${input.managerId}`);
      }

      const updatedDepartment = await dependencies.departmentRepository.update(
        input.id,
        {
          name: input.name,
          manager: manager,
        }
      );

      return { department: updatedDepartment };
    },
  };
}
