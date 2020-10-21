import path from "path";
import React from "react";
import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import { subscribe, unsubcribe } from "../../net/socket";
import Board from "./Board";
import { IBoardResourceTypePathMatch, OnClickDeleteBlock } from "./types";

export interface IBoardContainerProps {
    blockPath: string;
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onToggleFoldAppMenu: () => void;
    onClickDeleteBlock: OnClickDeleteBlock;
}

const BoardContainer: React.FC<IBoardContainerProps> = (props) => {
    const {
        blockPath,
        block,
        isMobile,
        isAppMenuFolded,
        onClickDeleteBlock,
        onToggleFoldAppMenu,
    } = props;

    const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
        `${blockPath}/:resourceType`
    );
    const resourceType =
        resourceTypeMatch && resourceTypeMatch.params.resourceType;

    React.useEffect(() => {
        subscribe([{ type: block.type as any, customId: block.customId }]);

        return () => {
            unsubcribe([{ type: block.type as any, customId: block.customId }]);
        };
    }, [block.customId, block.type]);

    // TODO: should we show error if block type is task?
    if (!resourceType) {
        const nextPath = path.normalize(blockPath + `/tasks`);
        return <Redirect to={nextPath} />;
    }

    return (
        <Board
            board={block}
            isAppMenuFolded={isAppMenuFolded}
            isMobile={isMobile}
            onClickDeleteBlock={onClickDeleteBlock}
            onToggleFoldAppMenu={onToggleFoldAppMenu}
        />
    );
};

export default BoardContainer;
