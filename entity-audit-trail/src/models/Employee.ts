export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type NewEmployee = Omit<Employee, "id">;

export type UpdateEmployee = Partial<Omit<Employee, "id">>;
