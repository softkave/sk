import { IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { BoardContext } from "./Board";

export function getChildrenTypesForContext(
  block: IBlock,
  context: BoardContext
) {
  const contextToRemove = context === "task" ? "project" : "task";
  const childrenTypes = getBlockValidChildrenTypes(block.type);

  return childrenTypes.filter(type => {
    return type !== contextToRemove;
  });
}
