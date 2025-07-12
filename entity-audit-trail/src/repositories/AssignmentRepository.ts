import * as prisma from "@prisma/client";
import type { PrismaClientWithEntityHistory } from ".";
import type { Assignment, NewAssignment } from "../models/Assignment";
import type { Employee } from "../models/Employee";
export class AssignmentRepository {
  constructor(private prisma: PrismaClientWithEntityHistory) {}

  mapFromPrisma(
    assignment: prisma.Assignment & {
      employee: prisma.Employee;
      department: prisma.Department & { manager: prisma.Employee };
    }
  ): Assignment {
    return {
      id: assignment.id,
      employee: assignment.employee,
      department: assignment.department,
      startDate: assignment.startDate,
      endDate: assignment.endDate === null ? undefined : assignment.endDate,
    };
  }

  async findAll(): Promise<Assignment[]> {
    return this.prisma.assignment
      .findMany({
        include: {
          employee: true,
          department: {
            include: {
              manager: true,
            },
          },
        },
      })
      .then((assignments) => assignments.map(this.mapFromPrisma));
  }

  async findByEmployeeWithNoEndDate(employeeId: number): Promise<Assignment[]> {
    return this.prisma.assignment
      .findMany({
        where: {
          employeeId: employeeId,
          endDate: null,
        },
        include: {
          employee: true,
          department: {
            include: {
              manager: true,
            },
          },
        },
      })
      .then((assignments) => assignments.map(this.mapFromPrisma));
  }

  async create(assignment: NewAssignment): Promise<Assignment> {
    return this.prisma.assignment
      .create({
        include: {
          employee: true,
          department: {
            include: {
              manager: true,
            },
          },
        },
        data: {
          ...assignment,
          employee: {
            connect: { id: assignment.employee.id },
          },
          department: {
            connect: { id: assignment.department.id },
          },
          endDate: assignment.endDate ? assignment.endDate : null,
        },
      })
      .then(this.mapFromPrisma);
  }

  async update(
    id: number,
    assignment: Partial<NewAssignment>
  ): Promise<Assignment> {
    return this.prisma.assignment
      .update({
        include: {
          employee: true,
          department: {
            include: {
              manager: true,
            },
          },
        },
        where: {
          id: id,
        },
        data: {
          ...assignment,
          employee: assignment.employee
            ? {
                connect: {
                  id: (assignment.employee as Employee).id,
                },
              }
            : undefined,
          department: assignment.department
            ? { connect: { id: (assignment.department as any).id } }
            : undefined,
          endDate: assignment.endDate ? assignment.endDate : null,
        },
      })
      .then(this.mapFromPrisma);
  }

  async get(id: number): Promise<Assignment> {
    const data = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        employee: true,
        department: {
          include: {
            manager: true,
          },
        },
      },
    });
    if (!data) {
      throw new Error(`Assignment with id ${id} not found`);
    }
    return this.mapFromPrisma(data);
  }
}
