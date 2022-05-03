import { BlockType, IBlock } from "../../models/block/block";
import { pluralize } from "../../utils/utils";
import { BoardResourceType } from "./types";

export const getBoardResourceTypeDisplayName = (
  resourceType?: BoardResourceType
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
