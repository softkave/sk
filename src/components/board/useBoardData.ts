import React from "react";
import { useDispatch } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { INetError } from "../../net/types";
import { loadBoardDataOperationAction } from "../../redux/operations/block/loadBoardData";
import OperationType from "../../redux/operations/OperationType";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";

export interface IUseBoardDataResult {
    loading: boolean;
    errors?: INetError[];
}

export function useBoardData(block: IBlock): IUseBoardDataResult {
    const dispatch = useDispatch();
    const loadOp = React.useCallback(
        (loadProps: IUseOperationStatus) => {
            if (block.type === BlockType.Org && !loadProps.operation) {
                dispatch(
                    loadBoardDataOperationAction({
                        block,
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [block, dispatch]
    );

    const loadStatus = useOperation(
        { resourceId: block.customId, type: OperationType.LoadBoardData },
        loadOp
    );

    return {
        loading:
            block.type === BlockType.Org
                ? loadStatus.isLoading || !loadStatus.operation
                : false,
        errors: loadStatus.error,
    };
}
