import { IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";

const useBlockChildrenTypes = (block: IBlock) => {
    const childrenTypes = getBlockValidChildrenTypes(block.type);
    return childrenTypes;
};

export default useBlockChildrenTypes;
