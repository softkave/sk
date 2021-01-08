import { getReducer } from "../utils";
import CommentActions from "./actions";

const commentsReducer = getReducer(CommentActions);

export default commentsReducer;
