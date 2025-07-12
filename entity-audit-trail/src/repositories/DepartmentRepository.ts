import type { PrismaClientWithEntityHistory } from ".";
import type {
  Department,
  NewDepartment,
  UpdateDepartment,
} from "../models/Department";

export class DepartmentRepository {
  constructor(private prisma: PrismaClientWithEntityHistory) {}

  async findAll(): Promise<Department[]> {
    return this.prisma.department.findMany({
      include: {
        manager: true,
      },
    });
  }

  async create(department: NewDepartment): Promise<Department> {
    return this.prisma.department.create({
      include: {
        manager: true,
      },
      data: {
        ...department,
        manager: {
          connect: { id: department.manager.id },
        },
      },
    });
  }

  async update(id: number, department: UpdateDepartment): Promise<Department> {
    return this.prisma.department.update({
      include: {
        manager: true,
      },
      where: { id },
      data: {
        ...department,
        manager: department.manager
          ? { connect: { id: department.manager.id } }
          : undefined,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.department.delete({
      where: { id },
    });
    return true;
  }

  async get(id: number): Promise<Department> {
    const data = await this.prisma.department.findUnique({
      where: { id },
      include: {
        manager: true,
      },
    });
    if (!data) {
      throw new Error(`Department with id ${id} not found`);
    }
    return data;
  }
}
