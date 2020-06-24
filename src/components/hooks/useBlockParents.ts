import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";

const useBlockParents = (block: IBlock) => {
  const parents = useSelector<IAppState, IBlock[]>((state) =>
    BlockSelectors.getBlockParents(state, block)
  );

  return parents;
};

export default useBlockParents;
