import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import BlockActions from "../../redux/blocks/actions";
import { fetchBlockMissingBroadcastsOpAction } from "../../redux/operations/block/fetchBlockMissingBroadcasts";
import OperationType from "../../redux/operations/OperationType";
import useOperation, { IOperationDerivedData } from "./useOperation";

export interface IUseFetchMissingBlockUpdatesProps {
    block: IBlock;
    isBlockDataLoaded: boolean;
}

export type UseFetchMissingBlockUpdates = (
    props: IUseFetchMissingBlockUpdatesProps
) => IOperationDerivedData;

const useFetchMissingBlockUpdates: UseFetchMissingBlockUpdates = (props) => {
    const { block, isBlockDataLoaded } = props;

    const dispatch = useDispatch();

    const missingBroadcastsLastFetchedAt =
        block.missingBroadcastsLastFetchedAt || 0;
    const userLeftBlockAt = block.userLeftBlockAt || 0;
    const shouldFetchMissingUpdates =
        isBlockDataLoaded && missingBroadcastsLastFetchedAt < userLeftBlockAt;

    const fetchMissingUpdates = React.useCallback(
        (loadProps: IOperationDerivedData) => {
            if (shouldFetchMissingUpdates) {
                dispatch(
                    BlockActions.updateBlock({
                        id: block.customId,
                        data: {
                            missingBroadcastsLastFetchedAt: Date.now(),
                        },
                    })
                );

                dispatch(
                    fetchBlockMissingBroadcastsOpAction({
                        blockId: block.customId,
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [dispatch, shouldFetchMissingUpdates, block]
    );

    const fetchMissingOp = useOperation(
        {
            resourceId: block.customId,
            type: OperationType.FetchBlockBroadcasts,
        },
        fetchMissingUpdates,
        { deleteManagedOperationOnUnmount: true }
    );

    React.useEffect(() => {
        return () => {
            dispatch(
                BlockActions.updateBlock({
                    id: block.customId,
                    data: {
                        userLeftBlockAt: Date.now(),
                    },
                })
            );
        };
    }, [block.customId, dispatch]);

    if (!shouldFetchMissingUpdates) {
        return {
            isLoading: false,
            isError: false,
            isCompleted: true,
            opId: "",
        };
    }

    return fetchMissingOp;
};

export default useFetchMissingBlockUpdates;
