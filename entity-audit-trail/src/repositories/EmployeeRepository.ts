import type { PrismaClientWithEntityHistory } from ".";
import type { Employee, NewEmployee, UpdateEmployee } from "../models/Employee";

export class EmployeeRepository {
  constructor(private prisma: PrismaClientWithEntityHistory) {}

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  async create(employee: NewEmployee): Promise<Employee> {
    return this.prisma.employee.create({
      data: employee,
    });
  }

  async update(id: number, employee: UpdateEmployee): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: employee,
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.employee.delete({
      where: { id },
    });
    return true;
  }

  async get(id: number): Promise<Employee> {
    const data = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!data) {
      throw new Error(`Employee with id ${id} not found`);
    }
    return data;
  }
}
