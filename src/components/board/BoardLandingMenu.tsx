import styled from "@emotion/styled";
import { Menu } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
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

  const renderCount = (item: BoardLandingMenuType) => {
    switch (item) {
      case "groups":
        return block.groups!.length;

      case "tasks":
        return block.tasks!.length;

      case "projects":
        return block.projects!.length;

      case "collaborators":
        return block.collaborators!.length;

      case "collaboration-requests":
        return block.collaborationRequests!.length;

      default:
        return null;
    }
  };

  // TODO: show selected child route, like by adding background color or something
  // TODO: show count and use badges only for new unseen entries

  return (
    <Menu onClick={event => onClick(event.key as BoardLandingMenuType)}>
      {hasGroups && (
        <Menu.Item key="groups">
          <StyledMenuItemTitle>Groups</StyledMenuItemTitle>
          {renderCount("groups")}
        </Menu.Item>
      )}
      {hasTasks && (
        <Menu.Item key="tasks">
          <StyledMenuItemTitle>Tasks</StyledMenuItemTitle>
          {renderCount("tasks")}
        </Menu.Item>
      )}
      {hasProjects && (
        <Menu.Item key="projects">
          <StyledMenuItemTitle>Projects</StyledMenuItemTitle>
          {renderCount("projects")}
        </Menu.Item>
      )}
      {hasCollaborators && (
        <Menu.Item key="collaborators">
          <StyledMenuItemTitle>Collaborators</StyledMenuItemTitle>
          {renderCount("collaborators")}
        </Menu.Item>
      )}
      {hasRequests && (
        <Menu.Item key="requests">
          <StyledMenuItemTitle>Collaboration Requests</StyledMenuItemTitle>
          {renderCount("collaboration-requests")}
        </Menu.Item>
      )}
    </Menu>
  );
};

export default BoardLandingMenu;

const StyledMenuItemTitle = styled.div({
  display: "flex",
  flex: 1,
  marginRight: "16px",
  textTransform: "capitalize"
});
