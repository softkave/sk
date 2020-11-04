import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import BlockSelectors from "../../redux/blocks/selectors";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import {
    IUnseenChatsCountByOrg,
    KeyValueKeys,
} from "../../redux/key-value/types";
import { getNotifications } from "../../redux/notifications/selectors";
import { loadRootBlocksOperationAction } from "../../redux/operations/block/loadRootBlocks";
import { getUserRoomsAndChatsOpAction } from "../../redux/operations/chat/getUserRoomsAndChats";
import { loadUserNotificationsOpAction } from "../../redux/operations/notification/loadUserNotifications";
import OperationType from "../../redux/operations/OperationType";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import useOperation, {
    IOperationDerivedData,
    mergeOps,
} from "../hooks/useOperation";
import OrgsMain from "./OrgsMain";

export interface IOrgsListContainerProps {
    hijackRender?: () => React.ReactElement;
}

const OrgsListContainer: React.FC<IOrgsListContainerProps> = (props) => {
    const { hijackRender } = props;

    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(SessionSelectors.assertGetUser);
    const unseenChatsCountMapByOrg = useSelector<
        IAppState,
        IUnseenChatsCountByOrg
    >((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.UnseenChatsCountByOrg)
    );

    const orgRouteMatch = useRouteMatch<{ orgId: string }>("/app/orgs/:orgId");

    const requestRouteMatch = useRouteMatch<{ requestId: string }>(
        "/app/notifications/:requestId"
    );

    const selectedId =
        orgRouteMatch?.params.orgId || requestRouteMatch?.params.requestId;

    const loadUserRoomsAndChats = React.useCallback(
        async (loadRequestsProps: IOperationDerivedData) => {
            const operation = loadRequestsProps.operation;
            const shouldLoad = !operation;

            if (shouldLoad) {
                await dispatch(
                    getUserRoomsAndChatsOpAction({
                        opId: loadRequestsProps.opId,
                    })
                );
            }
        },
        [dispatch]
    );

    const loadRoomsAndChatsOp = useOperation(
        { type: OperationType.GetUserRoomsAndChats },
        loadUserRoomsAndChats,
        {
            deleteManagedOperationOnUnmount: false,
        }
    );

    const loadOrgs = React.useCallback(
        async (loadOrgsProps: IOperationDerivedData) => {
            const operation = loadOrgsProps.operation;
            const shouldLoad = !operation;

            if (shouldLoad) {
                await dispatch(
                    loadRootBlocksOperationAction({ opId: loadOrgsProps.opId })
                );
                dispatch(
                    KeyValueActions.setKey({
                        key: KeyValueKeys.RootBlocksLoaded,
                        value: true,
                    })
                );
            }
        },
        [dispatch]
    );

    const orgsOp = useOperation(
        { type: OperationType.LOAD_ROOT_BLOCKS },
        loadOrgs,
        {
            deleteManagedOperationOnUnmount: false,
            waitFor: [loadRoomsAndChatsOp.operation],
            handleWaitForError: () => false,
        }
    );

    const loadRequests = React.useCallback(
        async (loadRequestsProps: IOperationDerivedData) => {
            const operation = loadRequestsProps.operation;
            const shouldLoad = !operation;

            if (shouldLoad) {
                await dispatch(
                    loadUserNotificationsOpAction({
                        opId: loadRequestsProps.opId,
                    })
                );
            }
        },
        [dispatch]
    );

    const requestsOp = useOperation(
        { type: OperationType.LoadUserNotifications },
        loadRequests,
        {
            deleteManagedOperationOnUnmount: false,
        }
    );

    const loadOpsState = mergeOps([orgsOp, requestsOp, loadRoomsAndChatsOp]);
    const errorMessage = loadOpsState.errors ? "Error loading data" : undefined;
    const isLoading = loadOpsState.loading;

    const orgs = useSelector<IAppState, IBlock[]>((state) => {
        if (!orgsOp.isCompleted) {
            return [];
        }

        return BlockSelectors.getBlocks(
            state,
            user.orgs.map((org) => org.customId)
        );
    });

    const requests = useSelector<IAppState, INotification[]>((state) => {
        if (!requestsOp.isCompleted) {
            return [];
        }

        return getNotifications(state, user.notifications || []);
    });

    const onAddOrg = React.useCallback(() => {
        dispatch(
            KeyValueActions.setKey({
                key: KeyValueKeys.ShowNewOrgForm,
                value: true,
            })
        );
    }, [dispatch]);

    const onSelectOrg = React.useCallback(
        (org: IBlock) => {
            history.push(`/app/orgs/${org.customId}`);
        },
        [history]
    );

    const onSelectRequest = React.useCallback(
        (request: INotification) => {
            history.push(`/app/notifications/${request.customId}`);
        },
        [history]
    );

    if (hijackRender) {
        return hijackRender();
    }

    return (
        <OrgsMain
            orgs={orgs}
            requests={requests}
            unseenChatsCountMapByOrg={unseenChatsCountMapByOrg}
            errorMessage={errorMessage}
            isLoading={isLoading}
            selectedId={selectedId}
            onAddOrg={onAddOrg}
            onSelectOrg={onSelectOrg}
            onSelectRequest={onSelectRequest}
        />
    );
};

export default React.memo(OrgsListContainer);
