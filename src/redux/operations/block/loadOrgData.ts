import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import { IRoom } from "../../../models/chat/types";
import {
    collaboratorFragment,
    errorFragment,
    notificationFragment,
} from "../../../models/fragments";
import { IUser } from "../../../models/user/user";
import { netCallWithAuth } from "../../../net/utils";
import { getDateString, getNewId, getNewTempId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import KeyValueActions from "../../key-value/actions";
import KeyValueSelectors from "../../key-value/selectors";
import { KeyValueKeys } from "../../key-value/types";
import NotificationActions from "../../notifications/actions";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import { IRoomsMap } from "../../rooms/types";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
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
      notifications {
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
    return netCallWithAuth({
        query,
        paths,
        variables: { blockId: block.customId },
    });
}

export interface ILoadOrgDataOperationActionArgs {
    block: IBlock;
}

export const loadOrgDataOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ILoadOrgDataOperationActionArgs>,
    IAppAsyncThunkConfig
>("blockOperation/loadBoardData", async (arg, thunkAPI) => {
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
        const result = await getData(arg.block);

        if (result.errors) {
            throw result.errors;
        }

        // Save collaborators
        const collaborators = result.data[collaboratorsPath].collaborators;
        thunkAPI.dispatch(UserActions.bulkAddUsers(collaborators));

        // Save notifications
        const notifications = result.data[notificationsPath].notifications;
        thunkAPI.dispatch(
            NotificationActions.bulkAddNotifications(notifications)
        );

        // Cache collaborator and notification ids in the block
        const notificationIds = notifications.map(
            (notification) => notification.customId
        );

        const collaboratorIds = collaborators.map(
            (collaborator) => collaborator.customId
        );

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: arg.block.customId,
                data: {
                    collaborators: collaboratorIds,
                    notifications: notificationIds,
                },
                meta: { arrayUpdateStrategy: "replace" },
            })
        );

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

        // End operation
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

        const tempRoomId = getNewTempId(collaborator.customId);
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
            // unseenChatsStartIndex: null,
            // unseenChatsCount: 0,
            unseenChatsStartIndex: null,
            unseenChatsCount: 3,
            chats: [
                {
                    customId: "1",
                    orgId,
                    message: "Hello World!",
                    sender: userId,
                    roomId: tempRoomId,
                    createdAt: getDateString(),
                    sending: true,
                },
                {
                    customId: "2",
                    orgId,
                    message: "Bye Bye World!",
                    sender: collaborator.customId,
                    roomId: tempRoomId,
                    createdAt: getDateString(),
                    errorMessage: "Error sending message",
                },
                {
                    customId: "3",
                    orgId,
                    message: "Another One!",
                    sender: collaborator.customId,
                    roomId: tempRoomId,
                    createdAt: getDateString(),
                },
            ],
            recipientId: collaborator.customId,
        };

        tempRooms.push(tempRoom);
    });

    return tempRooms;
}
