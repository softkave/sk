import defaultTo from "lodash/defaultTo";
import React from "react";
import { IBlock } from "../../models/block/block";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import GroupList from "../group/GroupList";
import ProjectList from "../project/ProjectList";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import Text from "../Text";
import MenuItem from "../utilities/MenuItem";
import BoardBaskets, { IBoardBasket } from "./BoardBaskets";
import BoardBlockChildren from "./BoardChildren";
import { BoardResourceType } from "./types";

export interface IBoardTypeListProps {
  block: IBlock;
  resourceTypes: BoardResourceType[];
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  onNavigate: (resourceType: BoardResourceType) => void;
  selectedResourceType?: BoardResourceType;
  noPadding?: boolean;
}

const BoardTypeList: React.FC<IBoardTypeListProps> = props => {
  const {
    block,
    onClickUpdateBlock,
    onClickBlock,
    selectedResourceType,
    resourceTypes,
    onNavigate,
    noPadding
  } = props;

  const hasTasks = resourceTypes.includes("tasks");
  const hasProjects = resourceTypes.includes("projects");
  const hasGroups = resourceTypes.includes("groups");
  const hasRequests = resourceTypes.includes("collaboration-requests");
  const hasCollaborators = resourceTypes.includes("collaborators");
  const tasksCount = defaultTo(block.tasks, []).length;
  const groupsCount = defaultTo(block.groups, []).length;
  const projectsCount = defaultTo(block.projects, []).length;
  const collaboratorsCount = defaultTo(block.collaborators, []).length;
  const requestsCount = defaultTo(block.collaborationRequests, []).length;

  const renderChildrenGroup = (
    blocks: IBlock[],
    emptyMessage: string,
    renderBasketFunc: (basket: IBoardBasket) => React.ReactNode
  ) => {
    return (
      <BoardBaskets
        blocks={blocks}
        emptyMessage={emptyMessage}
        getBaskets={() =>
          blocks.length > 0 ? [{ key: "blocks", blocks }] : []
        }
        renderBasket={basket => renderBasketFunc(basket)}
      />
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
            <ProjectList
              projects={projects}
              onClick={project => onClickBlock([project])}
            />
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
            <GroupList
              groups={groups}
              onClick={group => onClickBlock([group])}
            />
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

  const renderRoute = (renderChildren: () => React.ReactNode) => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          height: "100%",
          flex: 1,
          width: "100%",
          // maxWidth: "400px",
          padding: noPadding ? undefined : "0 16px"
          // margin: "0 auto"
        }}
      >
        {renderChildren()}
      </StyledContainer>
    );
  };

  if (!selectedResourceType) {
    return (
      <StyledContainer
        s={{ flexDirection: "column", maxWidth: "400px", padding: "16px" }}
      >
        {block.description && (
          <StyledContainer s={{ marginBottom: "16px" }}>
            <Text rows={3} text={block.description} />
          </StyledContainer>
        )}
        {hasGroups && (
          <MenuItem
            key="groups"
            content={groupsCount > 0 ? "Groups" : "Group"}
            count={groupsCount}
            onClick={() => onNavigate("groups")}
          />
        )}
        {hasTasks && (
          <MenuItem
            key="tasks"
            content={tasksCount === 1 ? "Task" : "Tasks"}
            count={tasksCount}
            onClick={() => onNavigate("tasks")}
          />
        )}
        {hasProjects && (
          <MenuItem
            key="projects"
            content={projectsCount === 1 ? "Project" : "Projects"}
            count={projectsCount}
            onClick={() => onNavigate("projects")}
          />
        )}
        {hasCollaborators && (
          <MenuItem
            key="collaborators"
            content={
              collaboratorsCount === 1 ? "Collaborator" : "Collaborators"
            }
            count={collaboratorsCount}
            onClick={() => onNavigate("collaborators")}
          />
        )}
        {hasRequests && (
          <MenuItem
            key="collaboration-requests"
            content={
              requestsCount === 1
                ? "Collaboration Request"
                : "Collaboration Requests"
            }
            count={requestsCount}
            onClick={() => onNavigate("collaboration-requests")}
          />
        )}
      </StyledContainer>
    );
  }

  switch (selectedResourceType) {
    case "collaboration-requests":
      return renderRoute(renderCollaborationRequests);

    case "collaborators":
      return renderRoute(renderCollaborators);

    case "groups":
      return renderRoute(renderGroups);

    case "projects":
      return renderRoute(renderProjects);

    case "tasks":
      return renderRoute(renderTasks);
  }
};

export default BoardTypeList;
