export interface IOperationActionBaseArgs {
  opId?: string;
  deleteOpOnComplete?: boolean;
}

export type GetOperationActionArgs<T> = T extends object
  ? T & IOperationActionBaseArgs
  : IOperationActionBaseArgs;
