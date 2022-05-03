import React from "react";
import { useHistory } from "react-router";
import { IAppOrganization } from "../../models/organization/types";
import { IBoard } from "../../models/board/types";
import BoardListContainer from "../board/BoardListContainer";
import ListHeader from "../utilities/ListHeader";
import { organizationSidebarClasses } from "./utils";
import BoardFormInDrawer from "../board/BoardFormInDrawer";
import { appBoardRoutes } from "../../models/board/utils";

export interface IOrganizationSidebarBoardsProps {
  organization: IAppOrganization;
}

const OrganizationSidebarBoards: React.FC<IOrganizationSidebarBoardsProps> = (
  props
) => {
  const { organization } = props;
  const history = useHistory();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [boardForm, setBoardForm] = React.useState<
    { board?: IBoard } | undefined
  >();

  const openBoardForm = React.useCallback((board?: IBoard) => {
    setBoardForm({ board });
  }, []);

  const closeBoardForm = React.useCallback(() => {
    // TODO: prompt the user if the user has unsaved changes
    setBoardForm(undefined);
  }, []);

  const onClickBoard = React.useCallback(
    (board: IBoard) => {
      history.push(appBoardRoutes.tasks(organization.customId, board.customId));
    },
    [organization.customId, history]
  );

  const formNode = boardForm && (
    <BoardFormInDrawer
      visible
      orgId={organization.customId}
      board={boardForm.board}
      onClose={closeBoardForm}
    />
  );

  return (
    <div className={organizationSidebarClasses.list}>
      {formNode}
      <ListHeader
        onCreate={() => openBoardForm()}
        onSearchTextChange={setSearchQuery}
        placeholder={"Search boards..."}
        className={organizationSidebarClasses.header}
        title={"Boards"}
      />
      <div>
        <BoardListContainer
          organizationId={organization.customId}
          searchQuery={searchQuery}
          onClick={onClickBoard}
        />
      </div>
    </div>
  );
};

export default React.memo(OrganizationSidebarBoards);
