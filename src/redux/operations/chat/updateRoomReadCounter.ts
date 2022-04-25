import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import ChatAPI, {
  IUpdateRoomReadCounterAPIParameters,
} from "../../../net/chat/chat";
import { getDateString, getNewId } from "../../../utils/utils";
import KeyValueActions from "../../key-value/actions";
import KeyValueSelectors from "../../key-value/selectors";
import { KeyValueKeys } from "../../key-value/types";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
  wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";
import { getRoomUserUnseenChatsCountAndStartIndex } from "./getUserRoomsAndChats";

export const updateRoomReadCounterOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IUpdateRoomReadCounterAPIParameters>,
  IAppAsyncThunkConfig
>("op/chat/updateRoomReadCounter", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();
  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(
    dispatchOperationStarted(
      opId,
      OperationType.UpdateRoomReadCounter,
      arg.roomId
    )
  );

  try {
    const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
    let readCounter = arg.readCounter || getDateString();

    if (!isDemoMode) {
      const result = await ChatAPI.updateRoomReadCounter({
        orgId: arg.orgId,
        readCounter: arg.readCounter,
        roomId: arg.roomId,
      });

      if (result && result.errors) {
        throw result.errors;
      }

      readCounter = result.readCounter;
    }

    completeUpdateRoomReadCounter(thunkAPI, arg.roomId, readCounter);
    thunkAPI.dispatch(
      dispatchOperationCompleted(
        opId,
        OperationType.UpdateRoomReadCounter,
        arg.roomId
      )
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(
        opId,
        OperationType.UpdateRoomReadCounter,
        error,
        arg.roomId
      )
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeUpdateRoomReadCounter(
  thunkAPI: IStoreLikeObject,
  roomId: string,
  readCounter: string
) {
  const user = SessionSelectors.assertGetUser(thunkAPI.getState());
  const room = RoomSelectors.getRoom(thunkAPI.getState(), roomId);
  const unseenChatsCountMapByOrg = KeyValueSelectors.getKey(
    thunkAPI.getState(),
    KeyValueKeys.UnseenChatsCountByOrg
  );

  const orgUnseenChatsCount = unseenChatsCountMapByOrg[room.orgId] || 0;
  const { unseenChatsCount } = getRoomUserUnseenChatsCountAndStartIndex(
    room,
    moment(readCounter)
  );

  if (orgUnseenChatsCount && room.unseenChatsCount) {
    const remainingCount =
      orgUnseenChatsCount - (room.unseenChatsCount - unseenChatsCount);

    thunkAPI.dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.UnseenChatsCountByOrg,
        value: {
          ...unseenChatsCountMapByOrg,
          [room.orgId]: remainingCount,
        },
      })
    );
  }

  thunkAPI.dispatch(
    RoomActions.updateRoomReadCounter({
      readCounter,
      roomId,
      userId: user.customId,
      isSignedInUser: true,
    })
  );
}
