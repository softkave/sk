import React from "react";
import { useDispatch } from "react-redux";
import { IBlock } from "../../models/block/block";
import { loadOrgDataOperationAction } from "../../redux/operations/block/loadOrgData";
import OperationType from "../../redux/operations/OperationType";
import useOperation, {
    IMergedOperationStats,
    IOperationDerivedData,
    mergeOps,
} from "../hooks/useOperation";

// For loading org data necessary for initialization, like users, requests, chat rooms, and messages
export function useLoadOrgData(org: IBlock): IMergedOperationStats {
    const dispatch = useDispatch();

    // Load org users and collaboration requests
    const loadOrgUsersAndRequests = React.useCallback(
        (loadProps: IOperationDerivedData) => {
            if (!loadProps.operation) {
                dispatch(
                    loadOrgDataOperationAction({
                        block: org,
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [org, dispatch]
    );

    const loadOrgUsersAndRequestsStatus = useOperation(
        {
            resourceId: org.customId,
            type: OperationType.LoadOrgUsersAndRequests,
        },
        loadOrgUsersAndRequests
    );

    return mergeOps([loadOrgUsersAndRequestsStatus]);
}
