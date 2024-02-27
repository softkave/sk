import { noop } from "lodash";
import React from "react";
import { IAppWorkspace } from "../../models/organization/types";
import BoardFormInDrawer from "../board/BoardFormInDrawer";
import BoardList from "../board/BoardList";
import { useOrganizationSidebarBoardsActions } from "../hooks/organization/useOrganizationSidebarBoardsActions";
import Scrollbar from "../utils/Scrollbar";
import ListHeader from "../utils/list/ListHeader";
import { organizationSidebarClasses } from "./utils";

export interface IWorkspaceSidebarBoardsProps {
  organization: IAppWorkspace;
}

const OrganizationSidebarBoards: React.FC<IWorkspaceSidebarBoardsProps> = (props) => {
  const { organization } = props;
  const actions = useOrganizationSidebarBoardsActions(props);

  if (actions.stateNode) {
    return actions.stateNode;
  }

  const formNode = actions.boardForm && (
    <BoardFormInDrawer
      visible
      orgId={organization.customId}
      board={actions.boardForm.board}
      onClose={actions.closeBoardForm}
    />
  );

  return (
    <div className={organizationSidebarClasses.root}>
      {formNode}
      <ListHeader
        onCreate={actions.openBoardForm}
        onSearchTextChange={noop}
        searchInputPlaceholder={"Search boards..."}
        className={organizationSidebarClasses.header}
        title={"Boards"}
        hideAddButton={!actions.canCreateBoard}
      />
      <Scrollbar>
        <BoardList
          selectable
          padItems
          selected={actions.selectedBoards}
          ids={organization.boardIds}
          onClick={actions.onSelectBoard}
        />
      </Scrollbar>
    </div>
  );
};

export default React.memo(OrganizationSidebarBoards);
