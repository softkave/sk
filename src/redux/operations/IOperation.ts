export type DefaultOperationStatusType = "start" | "complete" | "error";

export interface IOperationStatus<StatusType extends string = string> {
  status: string;
  timestamp: number;
  data?: any;
  meta?: any;
}

export default interface IOperation<> {
  operationID: string;
  operationStatusHistory: IOperationStatus[];
  startTimestamp: number;
  endTimestamp: number;
  readyStatus: string;
}
