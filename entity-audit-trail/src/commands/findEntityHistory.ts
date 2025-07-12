import type { Command } from ".";
import type { EntityHistory, EntityType } from "../models/EntityHistory";
import type { EntityHistoryRepository } from "../repositories/EntityHistoryRepository";

type Input = {
  entityType: EntityType;
  id: number;
};

type Output = {
  result: EntityHistory[];
};

export function buildFindEntityHistoryCommand(dependencies: {
  entityHistoryRepository: EntityHistoryRepository;
}): Command<Input, Output> {
  return {
    execute: async (input: Input): Promise<Output> => {
      const history =
        await dependencies.entityHistoryRepository.findEntityHistory(
          input.entityType,
          input.id
        );
      return { result: history };
    },
  };
}
