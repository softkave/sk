import { IBoard } from "../../models/board/types";
import { appMessages } from "../../models/messages";
import { IAppState } from "../types";
import { getSelectors } from "../utils";

const BoardSelectors = getSelectors<IBoard>("boards", {
  notFoundMessage: appMessages.boardNotFound,
});

export default BoardSelectors;
export function getOrganizationBoards(state: IAppState, organizationId: string) {
  return BoardSelectors.filter(state, (item) => item.workspaceId === organizationId);
}
