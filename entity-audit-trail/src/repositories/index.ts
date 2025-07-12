import { PrismaClient } from "@prisma/client";
import { AssignmentRepository } from "./AssignmentRepository";
import { DepartmentRepository } from "./DepartmentRepository";
import { EmployeeRepository } from "./EmployeeRepository";
import { createEntityHistoryMiddleware } from "./EntityHistoryMiddleware";
import { EntityHistoryRepository } from "./EntityHistoryRepository";

export type Repositories = {
  employeeRepository: EmployeeRepository;
  assignmentRepository: AssignmentRepository;
  departmentRepository: DepartmentRepository;
  entityHistoryRepository: EntityHistoryRepository;
  $prisma: PrismaClientWithEntityHistory;
};

export type PrismaClientWithEntityHistory = ReturnType<
  typeof createExtendedPrismaClient
>;

function createExtendedPrismaClient() {
  const prisma = new PrismaClient();
  const middleware = createEntityHistoryMiddleware(prisma);
  return prisma.$extends(middleware);
}

export async function buildRepositories(): Promise<Repositories> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const prisma = createExtendedPrismaClient();
  await prisma.$connect();

  return {
    employeeRepository: new EmployeeRepository(prisma),
    assignmentRepository: new AssignmentRepository(prisma),
    departmentRepository: new DepartmentRepository(prisma),
    entityHistoryRepository: new EntityHistoryRepository(prisma),
    $prisma: prisma,
  };
}
