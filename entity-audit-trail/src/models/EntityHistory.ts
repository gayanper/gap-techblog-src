export type EntityHistory = {
  id: number;
  entityId: number;
  entityType: EntityType;
  action: Action;
  changedBy: string;
  changedAt: Date;
  snapshot: Snapshot;
  diffs: JsonPatch[];
};

export type Action = "created" | "changed" | "deleted";
export type EntityType = "assignment" | "employee" | "department";
export type Snapshot = object & { id?: number };
export type JsonPatch = {
  path: string;
  value?: unknown;
  op: JsonPatchOperation;
};
export type JsonPatchOperation = "add" | "removed" | "replace";
