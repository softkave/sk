import React from "react";
import { useHistory } from "react-router";
import { appBoardPaths } from "../../../models/app/routes";
import { IBoard } from "../../../models/board/types";
import { IAppWorkspace } from "../../../models/organization/types";
import { SelectedItemsMap } from "../../utils/list/types";
import { toSelectedItemsMap02 } from "../../utils/list/utils";
import useBoardIdFromPath, { IUseBoardIdFromPathResult } from "../fromPath";
import { useLoadingNode } from "../useLoadingNode";
import { useFetchBoards } from "./useFetchBoards";

export interface IUseOrganizationSidebarBoardsActionsProps {
  organization: IAppWorkspace;
}

export interface IUseOrganizationSidebarBoardsActionsResult extends IUseBoardIdFromPathResult {
  canCreateBoard: boolean;
  boardForm?: { board?: IBoard };
  stateNode?: React.ReactElement | null;
  selectedBoards: SelectedItemsMap;
  openBoardForm: () => void;
  closeBoardForm: () => void;
  onSelectBoard: (board: IBoard) => void;
}

export const useOrganizationSidebarBoardsActions = (
  props: IUseOrganizationSidebarBoardsActionsProps
): IUseOrganizationSidebarBoardsActionsResult => {
  const { organization } = props;
  const history = useHistory();
  const [boardForm, setBoardForm] = React.useState<{ board?: IBoard } | undefined>();
  const boardsLoadingState = useFetchBoards(organization.customId);
  const { stateNode } = useLoadingNode(boardsLoadingState);

  const { boardId } = useBoardIdFromPath();

  const openBoardForm = (board?: IBoard) => {
    setBoardForm({ board });
  };

  const closeBoardForm = () => {
    // TODO: prompt the user if the user has unsaved changes
    setBoardForm(undefined);
  };

  const onSelectBoard = (board: IBoard) => {
    history.push(appBoardPaths.tasks(organization.customId, board.customId));
  };

  // TODO: auth check
  const canCreateBoard = true;
  return {
    boardId,
    canCreateBoard,
    boardForm,
    stateNode,
    openBoardForm,
    closeBoardForm,
    onSelectBoard,
    selectedBoards: toSelectedItemsMap02(boardId),
  };
};
