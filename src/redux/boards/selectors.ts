import { IBoard } from "../../models/board/types";
import { getSelectors } from "../utils";

const BoardSelectors = getSelectors<IBoard>("boards");

export default BoardSelectors;
