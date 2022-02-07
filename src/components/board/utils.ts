import path from "path-browserify";
import { BlockType, IBlock } from "../../models/block/block";
import { pluralize } from "../../utils/utils";
import { BoardResourceType } from "./types";

export const getBoardResourceTypeDisplayName = (
  resourceType?: BoardResourceType | null
) => {
  switch (resourceType) {
    case "collaboration-requests":
      return "collaboration requests";

    default:
      return resourceType;
  }
};

export const getBlockResourceTypes = (
  block: IBlock,
  childrenTypes: BlockType[]
) => {
  const blockResourceTypes: BoardResourceType[] = childrenTypes.map(
    (type) => pluralize(type) as BoardResourceType
  );

  if (block.type === "org") {
    blockResourceTypes.push("chat");
    blockResourceTypes.push("collaborators");
    blockResourceTypes.push("collaboration-requests");
  }

  return blockResourceTypes;
};

export const getBlockPath = (b: IBlock, parentPath?: string) => {
  const type = b.type;
  const blockPath = `/${pluralize(type)}/${b.customId}`;
  return path.normalize(`${parentPath ? parentPath : ""}${blockPath}`);
};

export const getBlocksPath = (blocks: IBlock[]) => {
  const blocksPath = `/app${blocks
    .map((block) => getBlockPath(block))
    .join("")}`;

  return path.normalize(blocksPath);
};

export const TASK_GROUPS = ["status", "labels"];
