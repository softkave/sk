import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { BoardContext } from "./Board";

export function getChildrenTypesForContext(block, context: BoardContext) {
  const contextToRemove = context === "task" ? "project" : "task";
  const childrenTypes = getBlockValidChildrenTypes(block);
  const contextToRemoveIndex = childrenTypes.indexOf(contextToRemove);

  if (contextToRemoveIndex !== -1) {
    childrenTypes.splice(contextToRemoveIndex, 1);
  }

  return childrenTypes;
}
