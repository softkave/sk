import { useStore } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { filterValidParentsForBlockType } from "../../models/block/utils";
import { getBlockChildren } from "../../redux/blocks/selectors";
import useBlockParents from "./useBlockParents";

const useBlockPossibleParents = (block: IBlock) => {
  const store = useStore();
  const parents = useBlockParents(block);
  const org = parents[0];
  const cache: any = {};
  let pp: IBlock[] = [];

  parents.reverse().forEach((p) => {
    let extra: IBlock[] = [];

    if (org && block.type !== BlockType.Board) {
      // TODO: improve, cause it loops through all blocks parents.length number of times
      extra = getBlockChildren(store.getState(), org, BlockType.Board);
    }

    pp = pp.concat(p, extra);
  });

  pp.forEach((p) => {
    if (p.type === block.type || !!cache[p.customId]) {
      return;
    }

    cache[p.customId] = p;
  });

  pp = Object.keys(cache).map((id) => cache[id]);

  return filterValidParentsForBlockType(pp, block.type);
};

export default useBlockPossibleParents;
