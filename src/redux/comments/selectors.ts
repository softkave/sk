import { IComment } from "../../models/comment/types";
import { getSelectors } from "../utils";

const CommentSelectors = getSelectors<IComment>("comments");

export default CommentSelectors;
