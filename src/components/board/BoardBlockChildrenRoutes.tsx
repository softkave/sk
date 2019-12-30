import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import { pluralize } from "../../utils/utils";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";

export interface IBoardBlockChildrenRoutesProps {
  block: IBlock;
  renderLandingMenu?: () => React.ReactNode;
  renderTasks?: () => React.ReactNode;
  renderProjects?: () => React.ReactNode;
  renderGroups?: () => React.ReactNode;
  renderCollaborators?: () => React.ReactNode;
  renderCollaborationRequests?: () => React.ReactNode;
}

const BoardBlockChildrenRoutes: React.FC<IBoardBlockChildrenRoutesProps> = props => {
  const {
    block,
    renderLandingMenu,
    renderCollaborationRequests,
    renderCollaborators,
    renderGroups,
    renderProjects,
    renderTasks
  } = props;
  const getPath = (forBlock: IBlock) => {
    const blockTypeFullName = getBlockTypeFullName(forBlock.type);
    return `/${pluralize(blockTypeFullName)}/${forBlock.customId}`;
  };

  const parentIDs = Array.isArray(block.parents) ? block.parents : [];
  const parents = useSelector<IReduxState, IBlock[]>(state =>
    getBlocksAsArray(state, parentIDs)
  );
  const parentPath = `/app${parents.map(getPath).join("")}`;
  const blockPath = `${parentPath}${getPath(block)}`;
  const childrenTypes = useBlockChildrenTypes(block);
  const hasTasks = childrenTypes.includes("task");
  const hasProjects = childrenTypes.includes("project");
  const hasGroups = childrenTypes.includes("group");
  const hasRequests = block.type === "org";
  const hasCollaborators = block.type === "org";

  const routes = (
    <Switch>
      {renderLandingMenu ? (
        <Route exact path={blockPath} render={renderLandingMenu} />
      ) : null}
      {hasTasks && <Route path={`${blockPath}/tasks`} render={renderTasks} />}
      {hasGroups && (
        <Route path={`${blockPath}/groups`} render={renderGroups} />
      )}
      {hasProjects && (
        <Route path={`${blockPath}/projects`} render={renderProjects} />
      )}
      {hasCollaborators && (
        <Route
          path={`${blockPath}/collaborators`}
          render={renderCollaborators}
        />
      )}
      {hasRequests && (
        <Route
          path={`${blockPath}/collaboration-requests`}
          render={renderCollaborationRequests}
        />
      )}
      <Route
        path={`${blockPath}/*`}
        render={() => <Redirect to={blockPath} />}
      />
    </Switch>
  );

  return routes;
};

export default BoardBlockChildrenRoutes;
