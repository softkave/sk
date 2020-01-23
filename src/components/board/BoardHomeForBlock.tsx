import { defaultTo } from "lodash";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import Text from "../Text";
import MenuItem from "../utilities/MenuItem";
import BoardBlockHeader from "./BoardBlockHeader";

export interface IBoardHomeForBlockProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickAddBlock: (type: BlockType) => void;
  onNavigateBack: () => void;
  onNavigate: (route: string) => void;
  onClickAddCollaborator: () => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardHomeForBlock: React.FC<IBoardHomeForBlockProps> = props => {
  const {
    block,
    onNavigate,
    onClickAddBlock,
    onClickAddCollaborator,
    onClickDeleteBlock,
    onClickUpdateBlock,
    onNavigateBack
  } = props;

  const childrenTypes = useBlockChildrenTypes(block);
  const hasTasks = childrenTypes.includes("task");
  const hasProjects = childrenTypes.includes("project");
  const hasGroups = childrenTypes.includes("group");
  const hasRequests = block.type === "org";
  const hasCollaborators = block.type === "org";
  const tasksCount = defaultTo(block.tasks, []).length;
  const groupsCount = defaultTo(block.groups, []).length;
  const projectsCount = defaultTo(block.projects, []).length;
  const collaboratorsCount = defaultTo(block.collaborators, []).length;
  const requestsCount = defaultTo(block.collaborationRequests, []).length;

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries
  // TODO: sort the entries by count?

  return (
    <StyledContainer s={{ flexDirection: "column" }}>
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          maxWidth: "400px",
          margin: "0px auto"
        }}
      >
        <StyledContainer s={{ marginBottom: "16px", padding: "0 24px" }}>
          <BoardBlockHeader
            block={block}
            onClickAddCollaborator={onClickAddCollaborator}
            onClickCreateNewBlock={onClickAddBlock}
            onClickDeleteBlock={() => onClickDeleteBlock(block)}
            onClickEditBlock={() => onClickUpdateBlock(block)}
            onNavigateBack={onNavigateBack}
          />
        </StyledContainer>
        {block.description && (
          <StyledContainer s={{ margin: "24px 0" }}>
            <Text rows={3} text={block.description} />
          </StyledContainer>
        )}
        {hasGroups && (
          <MenuItem
            bordered
            keepCountSpace
            key="groups"
            name={groupsCount > 0 ? "Groups" : "Group"}
            count={groupsCount}
            onClick={() => onNavigate("groups")}
          />
        )}
        {hasTasks && (
          <MenuItem
            bordered
            keepCountSpace
            key="tasks"
            name={tasksCount === 1 ? "Task" : "Tasks"}
            count={tasksCount}
            onClick={() => onNavigate("tasks")}
          />
        )}
        {hasProjects && (
          <MenuItem
            bordered
            keepCountSpace
            key="projects"
            name={projectsCount === 1 ? "Project" : "Projects"}
            count={projectsCount}
            onClick={() => onNavigate("projects")}
          />
        )}
        {hasCollaborators && (
          <MenuItem
            bordered
            keepCountSpace
            key="collaborators"
            name={collaboratorsCount === 1 ? "Collaborator" : "Collaborators"}
            count={collaboratorsCount}
            onClick={() => onNavigate("collaborators")}
          />
        )}
        {hasRequests && (
          <MenuItem
            keepCountSpace
            key="collaboration-requests"
            name={
              requestsCount === 1
                ? "Collaboration Request"
                : "Collaboration Requests"
            }
            count={requestsCount}
            onClick={() => onNavigate("collaboration-requests")}
          />
        )}
      </StyledContainer>
    </StyledContainer>
  );
};

export default BoardHomeForBlock;
