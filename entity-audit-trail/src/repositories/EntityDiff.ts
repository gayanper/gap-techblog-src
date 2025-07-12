import type { JsonPatch } from "../models/EntityHistory";

export type DiffResult = {
  patches: JsonPatch[];
};

type FlattenValue =
  | string
  | boolean
  | number
  | bigint
  | Array<FlattenValue>
  | null
  | undefined;

type FlattenEntry = {
  key: string;
  value: FlattenValue;
};

export function diff<E extends object | null>(
  oldRevision: E,
  newRevision: E
): DiffResult {
  const oldEntries = toFlattenEntries(oldRevision);
  const newEntries = toFlattenEntries(newRevision);
  const diffs: JsonPatch[] = [];

  if (newEntries.size === 0) {
    // this means the entity is deleted
    oldEntries.forEach((value, key) => {
      diffs.push({
        path: key,
        value: value,
        op: "removed",
      });
    });
    return {
      patches: diffs,
    };
  }

  // lets go through newEntries and see what has changed compared to oldEntries
  for (const entry of newEntries) {
    const { "0": key, "1": newValue } = entry;
    const oldValue = oldEntries.get(key);

    if (!oldValue) {
      diffs.push({
        path: key,
        op: "add",
        value: newValue,
      });
    } else if (oldValue && !newValue) {
      diffs.push({
        path: key,
        op: "removed",
        value: undefined,
      });
    } else if (!deepEqual(newValue, oldValue)) {
      diffs.push({
        path: key,
        op: "replace",
        value: newValue,
      });
    }
  }

  return {
    patches: diffs,
  };
}

function toFlattenEntries(obj: object | null): Map<string, FlattenValue> {
  const entries: FlattenEntry[] = [];
  flatten(obj, (key, value) => entries.push({ key, value }));
  return new Map<string, FlattenValue>(entries.map((e) => [e.key, e.value]));
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return false;
    }

    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => {
    if (key in obj2 && key in obj1) {
    }
    return deepEqual(obj1[key], obj2[key]);
  });
}

function flatten(
  obj: object | null,
  entryAccumulator: (key: string, value: FlattenValue) => void,
  parentKey?: string
) {
  if (!obj) {
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    const fqKey = parentKey ? `${parentKey}/${key}` : `/${key}`;

    if (typeof value === "object" || Array.isArray(value)) {
      flatten(value, entryAccumulator, fqKey);
    } else if (value === null) {
      entryAccumulator(fqKey, value);
    } else if (
      typeof value === "bigint" ||
      typeof value === "string" ||
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "undefined"
    ) {
      entryAccumulator(fqKey, value);
    }
  }
}
