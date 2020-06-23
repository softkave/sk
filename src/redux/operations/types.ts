export interface IOperationActionBaseArgs {
  opId?: string;
}

export type GetOperationActionArgs<T> = T & IOperationActionBaseArgs;
