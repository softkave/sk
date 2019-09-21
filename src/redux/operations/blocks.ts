import IOperation, {
  DefaultOperationStatusType,
  IOperationStatus
} from "./IOperation";

export interface ILoadRootBlocksOperationStatus extends IOperationStatus {
  status: DefaultOperationStatusType;
}

export interface ILoadBlocksOperation extends IOperation {
  operationStatusHistory: ILoadRootBlocksOperationStatus[];
}
