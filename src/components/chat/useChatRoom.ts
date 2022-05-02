import { useRequest } from "ahooks";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { messages } from "../../models/messages";
import {
  ISendMessageEndpointParameters,
  IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat/chat";
import { addRoomOpAction } from "../../redux/operations/chat/addRoom";
import { sendMessageOpAction } from "../../redux/operations/chat/sendMessage";
import { updateRoomReadCounterOpAction } from "../../redux/operations/chat/updateRoomReadCounter";
import RoomSelectors from "../../redux/rooms/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import useChatRooms from "./useChatRooms";

export function useChatRoom(orgId: string, recipientId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAppHidden,
    sortedRooms,
    chatRoomsLoadState,
    selectedRoomRecipientId,
    user,
  } = useChatRooms({ orgId });
  const appChatRoom = React.useMemo(() => {
    return sortedRooms.find((rm) => rm.recipient.customId === recipientId);
  }, [recipientId, sortedRooms]);
  const room = useSelector<IAppState, IRoom | undefined>((state) =>
    RoomSelectors.getRoom(state, recipientId)
  );
  const recipient = useSelector<IAppState, ICollaborator>((state) => {
    return UserSelectors.assertGetOne(state, recipientId);
  });

  const createRoom = React.useCallback(async () => {
    await dispatch(
      addRoomOpAction({
        orgId,
        recipientId: recipientId,
      })
    );
  }, [orgId, recipientId, dispatch]);
  const onSendMessage = React.useCallback(
    (args: ISendMessageEndpointParameters) => {
      dispatch(sendMessageOpAction(args));
    },
    [dispatch]
  );
  const updateRoomReadCounter = React.useCallback(
    (args: IUpdateRoomReadCounterAPIParameters) => {
      dispatch(updateRoomReadCounterOpAction(args));
    },
    [dispatch]
  );

  const createRoomResult = useRequest(createRoom, { manual: true });

  React.useEffect(() => {
    if (
      selectedRoomRecipientId &&
      appChatRoom?.isTempRoom &&
      !createRoomResult.loading &&
      !createRoomResult.error &&
      !room
    ) {
      createRoomResult.run();
    }
  }, [createRoomResult, appChatRoom, room, selectedRoomRecipientId]);

  let error: Error | Error[] | null = null;
  let loading: boolean = false;

  if (chatRoomsLoadState.error || createRoomResult.error) {
    error =
      chatRoomsLoadState.error ||
      createRoomResult.error ||
      new Error(messages.anErrorOccurred);
  } else if (
    chatRoomsLoadState.isLoading ||
    !chatRoomsLoadState.initialized ||
    createRoomResult.loading ||
    appChatRoom?.isTempRoom
  ) {
    loading = true;
  }

  return {
    room,
    error,
    loading,
    user,
    recipient,
    isAppHidden,
    appChatRoom,
    onSendMessage,
    updateRoomReadCounter,
  };
}
