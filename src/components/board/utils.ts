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

export const getBlockBoardTypes = (
  block: IBlock,
  isMobile: boolean = false
): BoardType[] => {
  let types: BoardType[] = [];

  switch (block.type) {
    case "org":
    case "project":
      types = ["kanban", "list", "tab"];
      break;

    case "group":
      types = ["list", "tab"];
      break;
  }

  if (isMobile) {
    types = types.filter(type => {
      if (type === "tab") {
        return false;
      }

      return true;
    });
  }

  return types;
};

export function getBlockLandingPage(block: IBlock): BlockLandingPage | null {
  let pageType: BlockLandingPage | null = null;

  const hasGroups = Array.isArray(block.groups) && block.groups.length > 0;
  const hasTasks = Array.isArray(block.tasks) && block.tasks.length > 0;

  if (hasTasks) {
    pageType = "tasks";
  } else if (block.type !== "org") {
    switch (block.type) {
      case "project":
        if (hasGroups) {
          pageType = "tasks";
        }
        break;

      case "group":
      case "task":
      default:
        pageType = "self";
    }
  } else {
    if (hasGroups) {
      // do nothing
    } else {
      pageType = "self";
    }
  }

  return pageType;
}
