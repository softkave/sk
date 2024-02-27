import { IComment } from "../../models/comment/types";

export interface ICommentsState {
  [key: string]: IComment;
}
