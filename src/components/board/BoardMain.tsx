import path from "path";
import React from "react";
import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { IBlock } from "../../models/block/block";
import { subscribe, unsubcribe } from "../../net/socket";
import Board from "./Board";
import {
    IBoardResourceTypePathMatch,
    OnClickAddCollaborator,
    OnClickAddOrEditLabel,
    OnClickAddOrEditStatus,
    OnClickDeleteBlock,
    OnClickUpdateBlock,
} from "./types";

export interface IBoardHomeForBlockProps {
    blockPath: string;
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onToggleFoldAppMenu: () => void;
    onClickUpdateBlock: OnClickUpdateBlock;
    onClickAddCollaborator: OnClickAddCollaborator;
    onClickAddOrEditLabel: OnClickAddOrEditLabel;
    onClickAddOrEditStatus: OnClickAddOrEditStatus;
    onClickDeleteBlock: OnClickDeleteBlock;
}

const BoardMain: React.FC<IBoardHomeForBlockProps> = (props) => {
    const {
        blockPath,
        block,
        onClickDeleteBlock,
        onClickUpdateBlock,
        isAppMenuFolded,
        onToggleFoldAppMenu,
        isMobile,
    } = props;

    const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
        `${blockPath}/:resourceType`
    );
    const resourceType =
        resourceTypeMatch && resourceTypeMatch.params.resourceType;

    React.useEffect(() => {
        subscribe(block.type as any, block.customId);
        return () => {
            unsubcribe(block.type as any, block.customId);
        };
    }, [block.customId, block.type]);

    // TODO: should we show error if block type is task?
    if (!resourceType) {
        const nextPath = path.normalize(blockPath + `/tasks`);
        return <Redirect to={nextPath} />;
    }

    return (
        <Board
            block={block}
            blockPath={blockPath}
            isAppMenuFolded={isAppMenuFolded}
            isMobile={isMobile}
            onClickDeleteBlock={onClickDeleteBlock}
            onClickEditBlock={onClickUpdateBlock}
            onToggleFoldAppMenu={onToggleFoldAppMenu}
        />
    );
};

export default BoardMain;
