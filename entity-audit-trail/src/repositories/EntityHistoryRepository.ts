import type { PrismaClientWithEntityHistory } from ".";
import type {
  Action,
  EntityHistory,
  EntityType,
} from "../models/EntityHistory";

export class EntityHistoryRepository {
  constructor(private prisma: PrismaClientWithEntityHistory) {}

  async findEntityHistory(
    entityType: EntityType,
    id: number
  ): Promise<EntityHistory[]> {
    const data = await this.prisma.entityHistory.findMany({
      where: {
        entityId: id,
        entityType: entityType,
      },
    });

    return data.map((data) => ({
      id: data.id,
      action: this.mapToAction(data.action),
      changedBy: data.changedBy,
      changedAt: new Date(data.changedAt),
      entityId: data.entityId,
      entityType: this.mapToEntityType(data.entityType),
      diffs: data.diff ? JSON.parse(data.diff?.toString()) : [],
      snapshot: data.snapshot ? JSON.parse(data.snapshot?.toString()) : {},
    }));
  }

  private mapToAction(raw: string): Action {
    switch (raw) {
      case "created":
        return "created";
      case "changed":
        return "changed";
      case "deleted":
        return "deleted";
      default:
        throw new Error(`Unknown action type: ${raw}`);
    }
  }

  private mapToEntityType(raw: string): EntityType {
    switch (raw) {
      case "employee":
        return "employee";
      case "department":
        return "department";
      case "assignment":
        return "assignment";
      default:
        throw new Error(`Unknown entity type: ${raw}`);
    }
  }
}
