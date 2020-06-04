import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { getBlockParents } from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/store";

const useBlockParents = (block: IBlock) => {
  const parents = useSelector<IAppState, IBlock[]>((state) =>
    getBlockParents(state, block)
  );

  return parents;
};

export default useBlockParents;
