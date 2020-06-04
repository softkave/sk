import { IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import useBlockParents from "./useBlockParents";

const useBlockChildrenTypes = (block: IBlock) => {
  const parents = useBlockParents(block);
  const hasParents = parents.length > 0;
  const parent0 = hasParents ? parents[parents.length - 1] : null;
  const parent0Type = parent0 && parent0.type;
  const childrenTypes = getBlockValidChildrenTypes(block.type, parent0Type);

  return childrenTypes;
};

export default useBlockChildrenTypes;
