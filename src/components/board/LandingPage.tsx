import defaultTo from "lodash/defaultTo";
import React from "react";
import { IBlock } from "../../models/block/block";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import Text from "../Text";
import MenuItem from "../utilities/MenuItem";
import { BoardResourceType } from "./types";

export interface IBoardLandingPageProps {
  block: IBlock;
  resourceTypes: BoardResourceType[];
  onNavigate: (resourceType: BoardResourceType) => void;
}

const BoardLandingPage: React.FC<IBoardLandingPageProps> = props => {
  const { block, resourceTypes, onNavigate } = props;

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

  const renderHome = desktop => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          maxWidth: "400px",
          padding: "16px",
          margin: desktop ? "0 auto" : 0
        }}
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
  };

  return (
    <RenderForDevice
      renderForDesktop={() => renderHome(true)}
      renderForMobile={() => renderHome(false)}
    />
  );
};

export default BoardLandingPage;
