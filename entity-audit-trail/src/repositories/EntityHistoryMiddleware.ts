import { Prisma, type PrismaClient } from "@prisma/client";
import { ContextManager } from "../contextMiddleware";
import type { Action, EntityType, Snapshot } from "../models/EntityHistory";
import { diff } from "./EntityDiff";

export function createEntityHistoryMiddleware(client: PrismaClient) {
  const fetchCurrentSnapshot = async (
    id: number | undefined,
    model: "Employee" | "Department" | "Assignment" | "EntityHistory"
  ): Promise<Snapshot | null> => {
    switch (model) {
      case "Employee":
        return client.employee.findUnique({ where: { id } });
      case "Department":
        return client.department.findUnique({ where: { id } });
      case "Assignment":
        return client.assignment.findUnique({ where: { id } });
      default:
        return null;
    }
  };

  const record = async (
    action: Action,
    current: Snapshot | null,
    incoming: Snapshot | null
  ): Promise<void> => {
    if (!incoming && !current) {
      throw new Error("At least one of current or incoming must be provided");
    }
    const snapshot = current ? current : incoming!;
    const entityId = snapshot.id;

    if (!entityId) {
      throw new Error("Snapshot must have an id");
    }

    const diffs = diff(current, incoming);
    if (diffs.patches.length === 0) {
      return; // No changes to record
    }

    const context = ContextManager.get();
    const currentUser = context?.userId || "system";

    await client.entityHistory.create({
      data: {
        action: action,
        changedBy: currentUser,
        changedAt: new Date(),
        entityId: entityId,
        entityType: getEntityType(snapshot),
        diff: JSON.stringify(diffs),
        snapshot: JSON.stringify(current),
      },
    });
  };

  const getEntityType = (snapshot: Snapshot): EntityType => {
    if ("firstName" in snapshot) {
      return "employee";
    } else if ("managerId" in snapshot) {
      return "department";
    } else {
      return "assignment";
    }
  };

  return Prisma.defineExtension({
    query: {
      $allModels: {
        async create({ args, query, model }) {
          if (model === "EntityHistory") {
            return;
          }

          const incoming = await query(args);
          await record("created", null, incoming);
          return incoming;
        },

        async createMany({ args, query, model }) {
          throw new Error("Not supported by EntityHistoryMiddleware");
        },

        async update({ args, query, model }) {
          if (model === "EntityHistory") {
            return;
          }

          const current = await fetchCurrentSnapshot(args.where.id, model);
          const incoming = await query(args);
          await record("changed", current, incoming);
          return incoming;
        },

        async updateMany({ args, query, model }) {
          throw new Error("Not supported by EntityHistoryMiddleware");
        },

        async delete({ args, query, model }) {
          if (model === "EntityHistory") {
            return;
          }

          const current = await fetchCurrentSnapshot(args.where.id, model);
          const incoming = await query(args);
          await record("deleted", current, incoming);
          return incoming;
        },

        async deleteMany({ args, query, model }) {
          throw new Error("Not supported by EntityHistoryMiddleware");
        },
      },
    },
  });
}
