import { defaultTo } from "lodash";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import Text from "../Text";
import MenuItem from "../utilities/MenuItem";
import BoardBlockHeader from "./BoardBlockHeader";
import { BoardType, IBoardResourceTypePathMatch } from "./types";
import { getBlockResourceTypes, sortBlockResourceTypesByCount } from "./utils";

export interface IBoardHomeForBlockProps {
  blockPath: string;
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickAddBlock: (type: BlockType) => void;
  onNavigate: (route: string) => void;
  onClickAddCollaborator: () => void;
  onClickDeleteBlock: (block: IBlock) => void;
}

const BoardHomeForBlock: React.FC<IBoardHomeForBlockProps> = props => {
  const {
    blockPath,
    block,
    onNavigate,
    onClickAddBlock,
    onClickAddCollaborator,
    onClickDeleteBlock,
    onClickUpdateBlock
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
  const resourceTypes = getBlockResourceTypes(block, childrenTypes);
  const sortedResourceTypes = sortBlockResourceTypesByCount(
    block,
    resourceTypes
  );

  const history = useHistory();
  const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
    `${blockPath}/:resourceType`
  );
  const resourceType =
    resourceTypeMatch && resourceTypeMatch.params.resourceType;
  const searchParams = new URLSearchParams(window.location.search);
  const boardType: BoardType = searchParams.get("bt") as BoardType;

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries
  // TODO: sort the entries by count?

  if (!boardType) {
    let destPath = blockPath;

    if (resourceType) {
      destPath = `${blockPath}/${resourceType}`;
    }

    return <Redirect to={`${destPath}?bt=${"list"}`} />;
  }

  if (boardType !== "list" && !resourceType) {
    return (
      <Redirect to={`${blockPath}/${sortedResourceTypes[0]}?bt=${boardType}`} />
    );
  }

  return (
    <StyledContainer s={{ flexDirection: "column", flex: 1 }}>
      <StyledContainer s={{ marginBottom: "16px", padding: "0 16px" }}>
        <BoardBlockHeader
          block={block}
          availableBoardTypes={["kanban", "list", "tab"]}
          selectedBoardType={boardType}
          resourceType={resourceType}
          onChangeBoardType={bt => {
            if (boardType !== bt) {
              let destPath = blockPath;

              if (resourceType) {
                destPath = `${blockPath}/${resourceType}`;
              }

              history.push(`${destPath}?bt=${bt}`);
            }
          }}
          onChangeKanbanResourceType={rt => {
            if (resourceType !== rt) {
              history.push(`${blockPath}/${rt}?bt=${boardType}`);
            }
          }}
          onClickAddCollaborator={onClickAddCollaborator}
          onClickCreateNewBlock={onClickAddBlock}
          onClickDeleteBlock={() => onClickDeleteBlock(block)}
          onClickEditBlock={() => onClickUpdateBlock(block)}
        />
      </StyledContainer>
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          maxWidth: "400px",
          margin: "0px auto"
        }}
      >
        {block.description && (
          <StyledContainer s={{ margin: "16px 0", padding: "0 16px" }}>
            <Text rows={3} text={block.description} />
          </StyledContainer>
        )}
        {hasGroups && (
          <MenuItem
            keepCountSpace
            key="groups"
            content={groupsCount > 0 ? "Groups" : "Group"}
            count={groupsCount}
            onClick={() => onNavigate("groups")}
          />
        )}
        {hasTasks && (
          <MenuItem
            keepCountSpace
            key="tasks"
            content={tasksCount === 1 ? "Task" : "Tasks"}
            count={tasksCount}
            onClick={() => onNavigate("tasks")}
          />
        )}
        {hasProjects && (
          <MenuItem
            keepCountSpace
            key="projects"
            content={projectsCount === 1 ? "Project" : "Projects"}
            count={projectsCount}
            onClick={() => onNavigate("projects")}
          />
        )}
        {hasCollaborators && (
          <MenuItem
            keepCountSpace
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
            keepCountSpace
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
    </StyledContainer>
  );
};

export default BoardHomeForBlock;
