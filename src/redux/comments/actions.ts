import { IComment } from "../../models/comment/types";
import { getActions } from "../utils";

const CommentActions = getActions<IComment>("comment");

export default CommentActions;
