import { BlockType, IBlock } from "../../models/block/block";
import { pluralize } from "../../utils/utils";
import { BoardResourceType } from "./types";

// export const blockResourceTypes: BoardResourceType[] = [
//   "collaboration-requests",
//   "collaborators",
//   "groups",
//   "projects",
//   "tasks"
// ];

export const blockResourceTypeToBlockKeyMap: {
  [key in BoardResourceType]: string;
} = {
  ["collaboration-requests"]: "collaborationRequests",
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
