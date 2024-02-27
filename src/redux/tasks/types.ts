import { ITask } from "../../models/task/types";

export interface ITasksState {
  [key: string]: ITask;
}
