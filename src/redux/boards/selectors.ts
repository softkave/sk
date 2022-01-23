import { IBoard } from "../../models/board/types";
import { messages } from "../../models/messages";
import { IAppState } from "../types";
import { getSelectors } from "../utils";

const BoardSelectors = getSelectors<IBoard>("boards", {
  notFoundMessage: messages.boardNotFound,
});

export default BoardSelectors;
export function getOrganizationBoards(
  state: IAppState,
  organizationId: string
) {
  return BoardSelectors.filter(state, (item) => item.parent === organizationId);
}
