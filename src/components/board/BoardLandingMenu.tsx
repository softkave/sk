import { defaultTo } from "lodash";
import React from "react";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import Text from "../Text";
import MenuItem from "../utilities/MenuItem";
import { BoardLandingMenuType } from "./types";

export interface IBoardLandingMenuProps {
  block: IBlock;
  onClick: (key: BoardLandingMenuType) => void;
}

const BoardLandingMenu: React.FC<IBoardLandingMenuProps> = props => {
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
    <StyledContainer>
      {block.description && <Text rows={3} text={block.description} />}
      {hasGroups && (
        <MenuItem
          key="groups"
          name={groupsCount > 0 ? "Groups" : "Group"}
          count={groupsCount}
          onClick={() => onClick("groups")}
        />
      )}
      {hasTasks && (
        <MenuItem
          key="tasks"
          name={tasksCount > 0 ? "Tasks" : "Task"}
          count={tasksCount}
          onClick={() => onClick("tasks")}
        />
      )}
      {hasProjects && (
        <MenuItem
          key="projects"
          name={projectsCount > 0 ? "Projects" : "Project"}
          count={projectsCount}
          onClick={() => onClick("projects")}
        />
      )}
      {hasCollaborators && (
        <MenuItem
          key="collaborators"
          name={collaboratorsCount > 0 ? "Collaborators" : "Collaborator"}
          count={collaboratorsCount}
          onClick={() => onClick("collaborators")}
        />
      )}
      {hasRequests && (
        <MenuItem
          key="collaboration-requests"
          name={
            requestsCount > 0
              ? "collaboration-requests"
              : "collaboration-requests"
          }
          count={requestsCount}
          onClick={() => onClick("collaboration-requests")}
        />
      )}
    </StyledContainer>
  );
};

export default BoardLandingMenu;
