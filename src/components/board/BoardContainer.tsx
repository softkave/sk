import path from "path";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { subscribe, unsubcribe } from "../../net/socket";
import { loadBlockChildrenOpAction } from "../../redux/operations/block/loadBlockChildren";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch } from "../../redux/types";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import Board from "./Board";
import { IBoardResourceTypePathMatch, OnClickDeleteBlock } from "./types";

export interface IBoardContainerProps {
    blockPath: string;
    board: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onToggleFoldAppMenu: () => void;
    onClickDeleteBlock: OnClickDeleteBlock;
}

const BoardContainer: React.FC<IBoardContainerProps> = (props) => {
    const {
        blockPath,
        board,
        isMobile,
        isAppMenuFolded,
        onClickDeleteBlock,
        onToggleFoldAppMenu,
    } = props;

    const dispatch: AppDispatch = useDispatch();

    const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
        `${blockPath}/:resourceType`
    );

    const resourceType =
        resourceTypeMatch && resourceTypeMatch.params.resourceType;

    const loadTasks = (loadProps: IUseOperationStatus) => {
        const shouldLoad = !loadProps.operation;

        if (shouldLoad) {
            dispatch(
                loadBlockChildrenOpAction({
                    block: board,
                    typeList: [BlockType.Task],
                    opId: loadProps.opId,
                })
            );
        }
    };

    const op = useOperation(
        {
            resourceId: board.customId,
            type: OperationType.LOAD_BLOCK_CHILDREN,
        },
        loadTasks,
        { deleteManagedOperationOnUnmount: false }
    );

    React.useEffect(() => {
        subscribe([{ type: board.type as any, customId: board.customId }]);

        return () => {
            unsubcribe([{ type: board.type as any, customId: board.customId }]);
        };
    }, [board.customId, board.type]);

    const isLoadingChildren = op.isLoading || !op.operation;

    if (isLoadingChildren) {
        return <LoadingEllipsis />;
    } else if (op && op.error) {
        return <GeneralErrorList fill errors={[op.error]} />;
    }

    // TODO: should we show error if block type is task?
    if (!resourceType) {
        const nextPath = path.normalize(blockPath + `/tasks`);
        return <Redirect to={nextPath} />;
    }

    return (
        <Board
            board={board}
            blockPath={blockPath}
            isAppMenuFolded={isAppMenuFolded}
            isMobile={isMobile}
            onClickDeleteBlock={onClickDeleteBlock}
            onToggleFoldAppMenu={onToggleFoldAppMenu}
        />
    );
};

export default BoardContainer;
