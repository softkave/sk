import { useStore } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { filterValidParentsForBlockType } from "../../models/block/utils";
import BlockSelectors from "../../redux/blocks/selectors";
import useBlockParents from "./useBlockParents";

const useBlockPossibleParents = (block: IBlock) => {
    const store = useStore();
    const parents = useBlockParents(block);
    const org = parents[0];
    const cache: any = {};
    let possibleParents: IBlock[] = [];

    parents.reverse().forEach((parent) => {
        let extra: IBlock[] = [];

        if (org && block.type !== BlockType.Board) {
            // TODO: improve, cause it loops through all blocks parents.length number of times
            extra = BlockSelectors.getBlockChildren(
                store.getState(),
                org,
                BlockType.Board
            );
        }

        possibleParents = possibleParents.concat(parent, extra);
    });

    possibleParents.forEach((parent) => {
        if (parent.type === block.type || !!cache[parent.customId]) {
            return;
        }

        cache[parent.customId] = parent;
    });

    possibleParents = Object.keys(cache).map((id) => cache[id]);

    return filterValidParentsForBlockType(possibleParents, block.type);
};

export default useBlockPossibleParents;
