import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { BoardContext } from "./Board";

export function getChildrenTypesForContext(block, context: BoardContext) {
  const contextToRemove = context === "task" ? "project" : "task";
  const childrenTypes = getBlockValidChildrenTypes(block);

  return childrenTypes.filter(type => {
    return type !== contextToRemove;
  });
}
