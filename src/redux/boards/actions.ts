import { IBoard } from "../../models/board/types";
import { getActions } from "../utils";

const BoardActions = getActions<IBoard>("board");

export default BoardActions;
