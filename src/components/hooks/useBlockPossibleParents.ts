import mapValues from "lodash/mapValues";
import { useStore } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
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

  return pp;
};

export default useBlockPossibleParents;
