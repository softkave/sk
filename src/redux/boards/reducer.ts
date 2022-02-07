import { getReducer } from "../utils";
import BoardActions from "./actions";

const boardsReducer = getReducer(BoardActions);

export default boardsReducer;
