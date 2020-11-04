import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { loadOrgDataOpAction } from "../../redux/operations/block/loadOrgData";
import OperationType from "../../redux/operations/OperationType";
import useOperation, {
    IMergedOperationStats,
    IOperationDerivedData,
    mergeOps,
} from "../hooks/useOperation";

// For loading org data necessary for initialization, like users, requests, etc.
export function useLoadOrgData(org: IBlock): IMergedOperationStats {
    const dispatch = useDispatch();

    // Load org users and collaboration requests
    const loadOrgData = React.useCallback(
        (loadProps: IOperationDerivedData) => {
            if (!loadProps.operation) {
                dispatch(
                    loadOrgDataOpAction({
                        block: org,
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [org, dispatch]
    );

    const loadOrgDataOp = useOperation(
        {
            resourceId: org.customId,
            type: OperationType.LoadOrgUsersAndRequests,
        },
        loadOrgData
    );

    // const fetchMissingOp = useFetchMissingBlockUpdates({
    //     block: org,
    //     isBlockDataLoaded: !!loadOrgDataOp,
    // });

    return mergeOps([loadOrgDataOp]);
    // return mergeOps([loadOrgDataOp, fetchMissingOp]);
}
