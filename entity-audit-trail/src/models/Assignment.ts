import type { Department } from "./Department";
import type { Employee } from "./Employee";

export type Assignment = {
  id: number;
  employee: Employee;
  department: Department;
  startDate: Date;
  endDate?: Date;
};

export type NewAssignment = Omit<Assignment, "id">;
export type UpdateAssignment = Partial<Omit<Assignment, "id">>;
