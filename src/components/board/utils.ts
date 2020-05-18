import { BlockLandingPage, BlockType, IBlock } from "../../models/block/block";
import { pluralize } from "../../utils/utils";
import { BoardResourceType, BoardViewType } from "./types";

const cbReq = "collaboration-requests";

export const blockResourceTypeToBlockKeyMap: {
  [key in BoardResourceType]: string;
} = {
  [cbReq]: "collaborationRequests",
  collaborators: "collaborators",
  groups: "groups",
  projects: "projects",
  tasks: "tasks",
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

export const getBoardViewTypeFullName = (
  resourceType?: BoardViewType | null
) => {
  switch (resourceType) {
    case "group-kanban":
      return "group kanban";

    case "list":
      return "list";

    case "status-kanban":
      return "status kanban";

    default:
      return null;
  }
};

export const sortBlockResourceTypesByCount = (
  block: IBlock,
  resourceTypes: BoardResourceType[]
) => {
  return resourceTypes
    .map((rt) => rt)
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
    (type) => pluralize(type) as BoardResourceType
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

export const getBoardViewTypesForResourceType = (
  block: IBlock,
  resourceType: BoardResourceType,
  isMobile: boolean = false
): BoardViewType[] => {
  switch (resourceType) {
    case "tasks":
      if (block.type === "group") {
        return ["list"];
      } else {
        return ["status-kanban", "group-kanban"];
      }

    case "projects":
      if (block.type === "group") {
        return ["list"];
      } else {
        return ["group-kanban"];
      }

    case "groups":
    case "collaborators":
    case "collaboration-requests":
      return ["list"];
  }
};

export const getDefaultBoardViewType = (block: IBlock) => {
  return getBoardViewTypesForResourceType(block, "tasks")[0];
};

export const getBlockTypeFromResourceType = (
  resourceType: BoardResourceType
): BlockType | null => {
  switch (resourceType) {
    case "groups":
      return "group";

    case "projects":
      return "project";

    case "tasks":
      return "task";

    default:
      return null;
  }
};

export const getResourceTypeFieldName = (resourceType: BoardResourceType) => {
  return blockResourceTypeToBlockKeyMap[resourceType];
};
