import type { Context } from ".";
import { AsyncLocalStorage } from "async_hooks";
import { IMiddlewareFunction } from "graphql-middleware";

export const ContextMiddleware: IMiddlewareFunction = async (
  resolve,
  parent,
  args,
  context,
  info
) => {
  return ContextManager.execWithContext(context, () =>
    resolve(parent, args, context, info)
  );
};

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export const ContextManager = {
  execWithContext: async (
    context: Context,
    callback: () => Promise<unknown>
  ) => {
    return asyncLocalStorage.run(context, callback);
  },

  get: (): Context | undefined => {
    return asyncLocalStorage.getStore();
  },
};
