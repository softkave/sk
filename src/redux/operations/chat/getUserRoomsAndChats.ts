import { createAsyncThunk } from "@reduxjs/toolkit";
import isNumber from "lodash/isNumber";
import moment, { Moment } from "moment";
import { IChat, IRoom } from "../../../models/chat/types";
import { getRoomFromPersistedRoom } from "../../../models/chat/utils";
import ChatAPI, { IPersistedRoom } from "../../../net/chat/chat";
import subscribeEvent from "../../../net/socket/outgoing/subscribeEvent";
import { getNewId } from "../../../utils/utils";
import KeyValueActions from "../../key-value/actions";
import { IUnseenChatsCountByOrg, KeyValueKeys } from "../../key-value/types";
import RoomActions from "../../rooms/actions";
import { IRoomsMap } from "../../rooms/types";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { IOperationActionBaseArgs } from "../types";

export const getUserRoomsAndChatsOpAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("op/chat/getUserRoomsAndChats", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.GetUserRoomsAndChats)
    );

    try {
        const result = await ChatAPI.getUserRoomsAndChats();

        if (result && result.errors) {
            throw result.errors;
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const { roomsMap, unseenChatsCountByOrg } = prepareChats(
            result.rooms,
            result.chats,
            user.customId
        );

        const roomsList = Object.keys(roomsMap).map(
            (roomId) => roomsMap[roomId]
        );

        thunkAPI.dispatch(RoomActions.bulkAddRooms(roomsList));
        thunkAPI.dispatch(
            KeyValueActions.setValues({
                [KeyValueKeys.UnseenChatsCountByOrg]: unseenChatsCountByOrg,
            })
        );

        subscribeEvent(
            roomsList.map((room) => ({ customId: room.customId, type: "room" }))
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.GetUserRoomsAndChats)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.GetUserRoomsAndChats,
                error
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), opId);
});

interface IPrepareChatsResult {
    unseenChatsCountByOrg: IUnseenChatsCountByOrg;
    roomsMap: IRoomsMap;
}

function prepareChats(
    persistedRooms: IPersistedRoom[],
    chats: IChat[],
    userId: string
): IPrepareChatsResult {
    const roomsMap: { [key: string]: IRoom } = {};

    persistedRooms.forEach((persistedRoom) => {
        const room = getRoomFromPersistedRoom(persistedRoom, userId);
        roomsMap[room.customId] = room;
    });

    chats.forEach((chat) => {
        if (roomsMap[chat.roomId]) {
            roomsMap[chat.roomId].chats.push(chat);
        }
    });

    const roomIds = Object.keys(roomsMap);
    const unseenChatsCountByOrg: { [key: string]: number } = {};

    roomIds.forEach((id) => {
        const room = roomsMap[id];

        room.chats.sort((chat1, chat2) => {
            const chat1SentTimestamp = moment(chat1.createdAt).valueOf();
            const chat2SentTimestamp = moment(chat2.createdAt).valueOf();

            if (chat1SentTimestamp > chat2SentTimestamp) {
                return 1;
            } else if (chat1SentTimestamp < chat2SentTimestamp) {
                return -1;
            } else {
                return 0;
            }
        });

        const member = room.members.find((m) => m.userId === userId)!;
        const readCounter = moment(member.readCounter);
        const {
            unseenChatsCount,
            unseenChatsStartIndex,
        } = getRoomUserUnseenChatsCountAndStartIndex(room, readCounter);

        room.unseenChatsStartIndex = unseenChatsStartIndex;
        room.unseenChatsCount = unseenChatsCount;
        unseenChatsCountByOrg[room.orgId] =
            (unseenChatsCountByOrg[room.orgId] || 0) + unseenChatsCount;
    });

    return {
        roomsMap,
        unseenChatsCountByOrg,
    };
}

export interface IRoomUnseenChatsCountAndStartIndex {
    unseenChatsCount: number;
    unseenChatsStartIndex: number | null;
}

export function getRoomUserUnseenChatsCountAndStartIndex(
    room: IRoom,
    readCounter: Moment
): IRoomUnseenChatsCountAndStartIndex {
    let unseenChatsStartIndex: number | null = null;

    for (let i = room.chats.length - 1; i >= 0; i--) {
        const chat = room.chats[i];
        const chatCreated = moment(chat.createdAt);

        if (chatCreated.isBefore(readCounter)) {
            break;
        }

        unseenChatsStartIndex = i;
    }

    const unseenChatsCount =
        isNumber(unseenChatsStartIndex) && unseenChatsStartIndex >= 0
            ? room.chats.length - unseenChatsStartIndex
            : 0;

    return {
        unseenChatsCount,
        unseenChatsStartIndex,
    };
}
