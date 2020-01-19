import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { getBlocksAsArray } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import { pluralize } from "../../utils/utils";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import GroupList from "../group/GL";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import ProjectList from "../project/PL";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TL";
import B from "./B";
import BoardBaskets, { IBoardBasket } from "./BoardBaskets";
import BoardBlockTypeHeader from "./BoardBlockTypeHeader";
import BoardBlockChildren from "./BoardChildren";
import Column from "./C";

export interface IBoardBlockChildrenRoutesProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickAddBlock: (type: BlockType) => void;
  onNavigateBack: () => void;
  onClickBlock: (block: IBlock) => void;
  onNavigate: (route: string) => void;
  onClickAddCollaborator: () => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardBlockChildrenRoutes: React.FC<IBoardBlockChildrenRoutesProps> = props => {
  const {
    block,
    onClickAddBlock,
    onClickUpdateBlock,
    onClickBlock,
    onNavigateBack,
    onNavigate,
    onClickAddCollaborator,
    onClickDeleteBlock
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

  const renderChildrenGroup = (
    blocks: IBlock[],
    emptyMessage: string,
    renderBasketFunc: (basket: IBoardBasket) => React.ReactNode
  ) => {
    return (
      <StyledContainer s={{ flex: 1, padding: "0 24px" }}>
        <BoardBaskets
          blocks={blocks}
          emptyMessage={emptyMessage}
          getBaskets={() =>
            blocks.length > 0 ? [{ key: "blocks", blocks }] : []
          }
          renderBasket={basket => <Column body={renderBasketFunc(basket)} />}
        />
      </StyledContainer>
    );
  };

  const renderTasks = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.tasks || []}
        render={tasks =>
          renderChildrenGroup(tasks, "No tasks yet.", () => (
            <TaskList
              tasks={tasks}
              toggleForm={task => onClickUpdateBlock(task)}
            />
          ))
        }
      />
    );
  };

  const renderProjects = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.projects || []}
        render={projects =>
          renderChildrenGroup(projects, "No projects yet.", () => (
            <ProjectList projects={projects} onClick={onClickBlock} />
          ))
        }
      />
    );
  };

  const renderGroups = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={groups =>
          renderChildrenGroup(groups, "No groups yet.", () => (
            <GroupList groups={groups} onClick={onClickBlock} />
          ))
        }
      />
    );
  };

  const renderCollaborators = () => {
    return <CollaboratorList organization={block} />;
  };

  const renderCollaborationRequests = () => {
    return <CollaborationRequests organization={block} />;
  };

  const r = (
    title: string,
    onClickCreate: () => void,
    renderChildren: () => React.ReactNode
  ) => {
    return (
      <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
        <StyledContainer s={{ padding: "0 24px" }}>
          <BoardBlockTypeHeader
            title={title}
            onClickCreate={onClickCreate}
            onNavigateBack={onNavigateBack}
          />
        </StyledContainer>
        <StyledContainer
          s={{ width: "100%", maxWidth: "400px", margin: "0 auto", flex: 1 }}
        >
          {renderChildren()}
        </StyledContainer>
      </StyledContainer>
    );
  };

  const routes = (
    <Switch>
      <Route
        exact
        path={blockPath}
        render={() => (
          <B
            block={block}
            onNavigate={onNavigate}
            onClickAddBlock={onClickAddBlock}
            onClickAddCollaborator={onClickAddCollaborator}
            onClickDeleteBlock={onClickDeleteBlock}
            onClickUpdateBlock={onClickUpdateBlock}
            onNavigateBack={onNavigateBack}
          />
        )}
      />
      {hasTasks && (
        <Route
          path={`${blockPath}/tasks`}
          render={() => r("tasks", () => onClickAddBlock("task"), renderTasks)}
        />
      )}
      {hasGroups && (
        <Route
          path={`${blockPath}/groups`}
          render={() =>
            r("groups", () => onClickAddBlock("group"), renderGroups)
          }
        />
      )}
      {hasProjects && (
        <Route
          path={`${blockPath}/projects`}
          render={() =>
            r("projects", () => onClickAddBlock("project"), renderProjects)
          }
        />
      )}
      {hasCollaborators && (
        <Route
          path={`${blockPath}/collaborators`}
          render={() =>
            r("collaborators", onClickAddCollaborator, renderCollaborators)
          }
        />
      )}
      {hasRequests && (
        <Route
          path={`${blockPath}/collaboration-requests`}
          render={() =>
            r(
              "collaboration requests",
              onClickAddCollaborator,
              renderCollaborationRequests
            )
          }
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