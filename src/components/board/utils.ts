import path from "path";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { pluralize } from "../../utils/utils";
import { BoardResourceType, BoardViewType } from "./types";

const cbReq = "collaboration-requests";

export const blockResourceTypeToBlockKeyMap: {
  [key in BoardResourceType]: string;
} = {
  [cbReq]: "collaborationRequests",
  collaborators: "collaborators",
  boards: "boards",
  tasks: "tasks",
};

export const getBoardResourceTypeFullName = (
  resourceType?: BoardResourceType | null
) => {
  switch (resourceType) {
    case "collaboration-requests":
      return "collaboration requests";

    case "collaborators":
    case "boards":
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

export const getBoardViewTypesForResourceType = (
  block: IBlock,
  resourceType: BoardResourceType
): BoardViewType[] => {
  switch (resourceType) {
    case "tasks":
      return ["status-kanban"];

    case "boards":
      return ["list"];

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
    case "boards":
      return BlockType.Board;

    case "tasks":
      return BlockType.Task;

    default:
      return null;
  }
};

export const getResourceTypeFieldName = (resourceType: BoardResourceType) => {
  return blockResourceTypeToBlockKeyMap[resourceType];
};

export const getBlockPath = (b: IBlock, parentPath?: string) => {
  const type = getBlockTypeFullName(b.type);
  const blockPath = `/${pluralize(type)}/${b.customId}`;
  return path.normalize(`${parentPath ? parentPath : ""}${blockPath}`);
};

export const getBlocksPath = (blocks: IBlock[]) => {
  const blocksPath = `/app${blocks
    .map((block) => getBlockPath(block))
    .join("")}`;
  return path.normalize(blocksPath);
};

export const isBlockRelatedResourceType = (type?: BoardResourceType | null) => {
  switch (type) {
    case "boards":
    case "tasks":
      return true;

    case "collaborators":
    case "collaboration-requests":
    default:
      return false;
  }
};
