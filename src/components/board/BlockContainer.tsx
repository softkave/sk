import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";
import Message from "../Message";

const DEFAULT_NOT_FOUND_TEXT = "Block not found";

export interface IBlockContainerProps {
    blockId: string;

    notFoundMessage?: string;
    render?: (block: IBlock) => React.ReactElement;
}

const BlockContainer: React.FC<IBlockContainerProps> = (props) => {
    const { blockId, notFoundMessage, render } = props;
    const block = useSelector<IAppState, IBlock | undefined>((state) =>
        BlockSelectors.getBlock(state, blockId)
    );

    if (!block) {
        return <Message message={notFoundMessage || DEFAULT_NOT_FOUND_TEXT} />;
    }

    return render!(block);
};

export default BlockContainer;
