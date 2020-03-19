import { BlockLandingPage, BlockType, IBlock } from "../../models/block/block";
import { pluralize } from "../../utils/utils";
import { BoardResourceType, BoardType } from "./types";

const cbReq = "collaboration-requests";

export const blockResourceTypeToBlockKeyMap: {
  [key in BoardResourceType]: string;
} = {
  [cbReq]: "collaborationRequests",
  collaborators: "collaborators",
  groups: "groups",
  projects: "projects",
  tasks: "tasks"
};

export const getBoardResourceTypeFullName = (
  resourceType?: BoardResourceType | null
) => {
  switch (resourceType) {
    case "collaboration-requests":
      return "collaboration requests";

    case "collaborators":
    case "groups":
    case "projects":
    case "tasks":
      return resourceType;

    default:
      return null;
  }
};

export const sortBlockResourceTypesByCount = (
  block: IBlock,
  resourceTypes: BoardResourceType[]
) => {
  return resourceTypes
    .map(rt => rt)
    .sort((a, b) => {
      return (
        (block[blockResourceTypeToBlockKeyMap[a]] || 0) -
        (block[blockResourceTypeToBlockKeyMap[b]] || 0)
      );
    });
};

export const getBlockResourceTypes = (
  block: IBlock,
  childrenTypes: BlockType[]
) => {
  const blockResourceTypes: BoardResourceType[] = childrenTypes.map(
    type => pluralize(type) as BoardResourceType
  );

  if (block.type === "org") {
    blockResourceTypes.push("collaborators");
    blockResourceTypes.push("collaboration-requests");
  }

  return blockResourceTypes;
};

export function getBlockLandingPage(block: IBlock): BlockLandingPage | null {
  const hasGroups = Array.isArray(block.groups) && block.groups.length > 0;
  const hasTasks = Array.isArray(block.tasks) && block.tasks.length > 0;
  const hasProjects =
    Array.isArray(block.projects) && block.projects.length > 0;

  if (block.type === "org") {
    if (hasGroups) {
      return null;
    }
  } else if (block.type === "project" && hasGroups) {
    return "tasks";
  } else if (hasTasks) {
    return "tasks";
  } else if (hasProjects) {
    return "projects";
  }

  return "self";
}

export const getBoardTypesForResourceType = (
  block: IBlock,
  resourceType: BoardResourceType,
  isMobile: boolean
): BoardType[] => {
  const hasGroups = Array.isArray(block.groups) && block.groups.length > 0;
  let boardTypes: BoardType[] = [];

  switch (resourceType) {
    case "tasks":
    case "projects":
      boardTypes = ["list", "tab"];

      if (hasGroups && !isMobile) {
        boardTypes.unshift("kanban");
      }

      break;

    case "groups":
    case "collaborators":
    case "collaboration-requests":
      boardTypes = ["list", "tab"];
  }

  return boardTypes;
};
