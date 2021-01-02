import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import { IRoom } from "../../../models/chat/types";
import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import {
    collaboratorFragment,
    errorFragment,
    notificationFragment,
} from "../../../net/fragments";
import { invokeGraphQLWithAuth } from "../../../net/utils";
import { getNewId, getNewTempId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import KeyValueActions from "../../key-value/actions";
import KeyValueSelectors from "../../key-value/selectors";
import { KeyValueKeys } from "../../key-value/types";
import NotificationActions from "../../notifications/actions";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import { IRoomsMap } from "../../rooms/types";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

const query = `
${errorFragment}
${collaboratorFragment}
${notificationFragment}
query LoadOrgDataQuery ($blockId: String!) {
    block {
        getBlockCollaborators (blockId: $blockId) {
            errors {
                ...errorFragment
            }
            collaborators {
                ...collaboratorFragment
            }
        }
        getBlockNotifications (blockId: $blockId) {
            errors {
                ...errorFragment
            }
            requests {
                ...notificationFragment
            }
        }
    }
}
`;

const collaboratorsPath = "block.getBlockCollaborators";
const notificationsPath = "block.getBlockNotifications";
const paths = [collaboratorsPath, notificationsPath];

async function getData(block: IBlock) {
    return invokeGraphQLWithAuth({
        query,
        paths,
        variables: { blockId: block.customId },
    });
}

export interface ILoadOrgDataOperationActionArgs {
    block: IBlock;
}

export const loadOrgDataOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ILoadOrgDataOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/block/loadBoardData", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.LoadOrgUsersAndRequests,
            arg.block.customId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await getData(arg.block);

            if (result.errors) {
                throw result.errors;
            }

            const collaborators = result.data[collaboratorsPath].collaborators;
            const notifications = result.data[notificationsPath].requests;

            storeOrgNotifications(thunkAPI, arg.block.customId, notifications);
            storeOrgCollaborators(thunkAPI, arg.block.customId, collaborators);

            // Generate org temp rooms
            const existingRooms = RoomSelectors.getOrgRooms(
                thunkAPI.getState(),
                arg.block.customId
            );

            const user = SessionSelectors.assertGetUser(thunkAPI.getState());
            const tempRooms = createOrgCollaboratorsTempRooms(
                collaborators,
                existingRooms,
                user.customId,
                arg.block.customId
            );

            thunkAPI.dispatch(RoomActions.bulkAddRooms(tempRooms));

            const unseenChatsCountMapByOrg = KeyValueSelectors.getKey(
                thunkAPI.getState(),
                KeyValueKeys.UnseenChatsCountByOrg
            );

            const a = { ...unseenChatsCountMapByOrg };

            tempRooms.forEach((rm) => {
                a[rm.orgId] = (a[rm.orgId] || 0) + rm.unseenChatsCount;
            });

            thunkAPI.dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.UnseenChatsCountByOrg,
                    value: a,
                })
            );
        } else {
            thunkAPI.dispatch(
                BlockActions.updateBlock({
                    id: arg.block.customId,
                    data: {
                        collaborators: [],
                        notifications: [],
                    },
                    meta: { arrayUpdateStrategy: "replace" },
                })
            );
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.LoadOrgUsersAndRequests,
                arg.block.customId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.LoadOrgUsersAndRequests,
                error,
                arg.block.customId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

function createOrgCollaboratorsTempRooms(
    collaborators: IUser[],
    existingRooms: IRoom[],
    userId: string,
    orgId: string
) {
    const existingRoomsMapByRecipientId: IRoomsMap = {};

    existingRooms.forEach((room) => {
        const recipientMemberData = room.members.find(
            (member) => member.userId !== userId
        )!;
        existingRoomsMapByRecipientId[recipientMemberData.userId] = room;
    });

    const tempRooms: IRoom[] = [];

    collaborators.forEach((collaborator) => {
        if (collaborator.customId === userId) {
            return;
        }

        const existingRoom =
            existingRoomsMapByRecipientId[collaborator.customId];

        if (!!existingRoom) {
            return;
        }

        // Collaborator can share multiple orgs with user
        const tempRoomId = getNewTempId(orgId + "-" + collaborator.customId);
        const tempRoom: IRoom = {
            orgId,
            customId: tempRoomId,
            name: "",
            createdAt: "",
            createdBy: "",
            members: [
                { userId, readCounter: "" },
                { userId: collaborator.customId, readCounter: "" },
            ],
            recipientId: collaborator.customId,
            unseenChatsStartIndex: null,
            unseenChatsCount: 0,
            chats: [],
        };

        tempRooms.push(tempRoom);
    });

    return tempRooms;
}

export function storeOrgNotifications(
    store: IStoreLikeObject,
    blockId: string,
    notifications: INotification[]
) {
    store.dispatch(NotificationActions.bulkAddNotifications(notifications));

    const notificationIds = notifications.map(
        (notification) => notification.customId
    );

    store.dispatch(
        BlockActions.updateBlock({
            id: blockId,
            data: {
                notifications: notificationIds,
            },
            meta: { arrayUpdateStrategy: "replace" },
        })
    );
}

export function storeOrgCollaborators(
    store: IStoreLikeObject,
    blockId: string,
    collaborators: IUser[]
) {
    store.dispatch(UserActions.bulkAddUsers(collaborators));

    const collaboratorIds = collaborators.map(
        (collaborator) => collaborator.customId
    );

    store.dispatch(
        BlockActions.updateBlock({
            id: blockId,
            data: {
                collaborators: collaboratorIds,
            },
            meta: { arrayUpdateStrategy: "replace" },
        })
    );
}
