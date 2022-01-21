import { IBoard } from "../../models/board/types";
import { messages } from "../../models/messages";
import { getSelectors } from "../utils";

const BoardSelectors = getSelectors<IBoard>("boards", {
    notFoundMessage: messages.boardNotFound,
});

export default BoardSelectors;
