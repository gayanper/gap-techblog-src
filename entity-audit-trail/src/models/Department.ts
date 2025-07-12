import type { Employee } from "./Employee";

export type Department = {
  id: number;
  name: string;
  manager: Employee;
};

export type NewDepartment = Omit<Department, "id">;
export type UpdateDepartment = Partial<Omit<Department, "id">>;
