import type { Command } from ".";
import type { Department, NewDepartment } from "../models/Department";
import type { DepartmentRepository } from "../repositories/DepartmentRepository";
import type { EmployeeRepository } from "../repositories/EmployeeRepository";

type Input = {
  name: string;
  managerId: number;
};

type Output = {
  department: Department;
};

export function buildCreateDepartmentCommand(dependencies: {
  departmentRepository: DepartmentRepository;
  employeeRepository: EmployeeRepository;
}): Command<Input, Output> {
  return {
    async execute(input) {
      const manager = await dependencies.employeeRepository.get(
        input.managerId
      );
      if (!manager) {
        throw new Error(`Manager not found for id ${input.managerId}`);
      }

      const newDepartment: NewDepartment = {
        name: input.name,
        manager: manager,
      };
      const department = await dependencies.departmentRepository.create(
        newDepartment
      );
      return { department };
    },
  };
}
