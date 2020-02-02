import React from "react";
import { IBlock } from "../../models/block/block";
import CollaborationRequests from "../collaborator/CollaborationRequests";
import CollaboratorList from "../collaborator/CollaboratorList";
import GroupList from "../group/GroupList";
import ProjectList from "../project/ProjectList";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import Text from "../Text";
import BoardBaskets, { IBoardBasket } from "./BoardBaskets";
import BoardBlockChildren from "./BoardChildren";
import Column from "./Column";
import { BoardResourceType } from "./types";

export interface IBoardTypeListProps {
  block: IBlock;
  resourceType?: BoardResourceType;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (block: IBlock) => void;
}

const BoardTypeList: React.FC<IBoardTypeListProps> = props => {
  const { block, onClickUpdateBlock, onClickBlock, resourceType } = props;

  const renderChildrenGroup = (
    blocks: IBlock[],
    emptyMessage: string,
    renderBasketFunc: (basket: IBoardBasket) => React.ReactNode
  ) => {
    return (
      <StyledContainer s={{ flex: 1 }}>
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

  const renderRoute = (renderChildren: () => React.ReactNode) => {
    return (
      <StyledContainer s={{ flexDirection: "column", height: "100%", flex: 1 }}>
        <StyledContainer
          s={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            flex: 1,
            flexDirection: "column"
          }}
        >
          {renderChildren()}
        </StyledContainer>
      </StyledContainer>
    );
  };

  if (!resourceType) {
    return (
      <StyledContainer>
        {block.description && (
          <StyledContainer s={{ margin: "16px 0", padding: "0 16px" }}>
            <Text rows={3} text={block.description} />
          </StyledContainer>
        )}
      </StyledContainer>
    );
  }

  switch (resourceType) {
    case "collaboration-requests":
      return renderRoute(renderCollaborationRequests);

    case "collaborators":
      renderRoute(renderCollaborators);

    case "groups":
      return renderRoute(renderGroups);

    case "projects":
      return renderRoute(renderProjects);

    case "tasks":
      return renderRoute(renderTasks);
  }
};

export default BoardTypeList;
