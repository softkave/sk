import { useStore } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockChildren } from "../../redux/blocks/selectors";
import useBlockParents from "./useBlockParents";

const useBlockPossibleParents = (block: IBlock) => {
  const store = useStore();
  const parents = useBlockParents(block);
  const org = parents[0];
  let pp: IBlock[] = [];

  parents.reverse().forEach((p) => {
    let extra: IBlock[] = [];

    if (org && block.type !== BlockType.Board) {
      extra = getBlockChildren(store.getState(), org, BlockType.Board);
    }

    pp = pp.concat(p, extra);
  });

  pp = pp.filter((p) => p.type !== block.type);

  return pp;
};

export default useBlockPossibleParents;
