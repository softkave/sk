import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";

const useBlockParents = (parentId?: string) => {
    const parents = useSelector<IAppState, IBlock[]>((state) =>
        BlockSelectors.getBlockParents(state, parentId)
    );

    return parents;
};

export default useBlockParents;
