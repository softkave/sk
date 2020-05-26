import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlockParents } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";

const useBlockParents = (block: IBlock) => {
  const parents = useSelector<IReduxState, IBlock[]>(state =>
    getBlockParents(state, block)
  );

  return parents;
};

export default useBlockParents;
