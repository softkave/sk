import { IWorkspaceResource } from "../app/types";

export interface IComment extends IWorkspaceResource {
  taskId: string;
  comment: string;
}
