import { defaultTo } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import MenuItem from "../utilities/MenuItem";

export type BlockChildrenMenuItemType =
  | "groups"
  | "tasks"
  | "projects"
  | "collaborators"
  | "collaboration-requests";

export interface IBlockChildrenMenuItemsProps {
  block: IBlock;
  onClick: (key: BlockChildrenMenuItemType) => void;
}

const BlockChildrenMenuItems: React.FC<IBlockChildrenMenuItemsProps> = props => {
  const { block, onClick } = props;

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
      {hasGroups && (
        <MenuItem
          keepCountSpace
          key="groups"
          content={groupsCount > 0 ? "Groups" : "Group"}
          count={groupsCount}
          onClick={() => onClick("groups")}
        />
      )}
      {hasTasks && (
        <MenuItem
          keepCountSpace
          key="tasks"
          content={tasksCount === 1 ? "Task" : "Tasks"}
          count={tasksCount}
          onClick={() => onClick("tasks")}
        />
      )}
      {hasProjects && (
        <MenuItem
          keepCountSpace
          key="projects"
          content={projectsCount === 1 ? "Project" : "Projects"}
          count={projectsCount}
          onClick={() => onClick("projects")}
        />
      )}
      {hasCollaborators && (
        <MenuItem
          keepCountSpace
          key="collaborators"
          content={collaboratorsCount === 1 ? "Collaborator" : "Collaborators"}
          count={collaboratorsCount}
          onClick={() => onClick("collaborators")}
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
          onClick={() => onClick("collaboration-requests")}
        />
      )}
    </StyledContainer>
  );
};

export default BlockChildrenMenuItems;
