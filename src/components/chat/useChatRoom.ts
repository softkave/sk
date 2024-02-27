import { useRequest } from "ahooks";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import {
  ISendMessageEndpointParameters,
  IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat/chat";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { ILoadingState, appLoadingKeys } from "../../redux/key-value/types";
import { addRoomOpAction } from "../../redux/operations/chat/addRoom";
import { getRoomChatsOpAction } from "../../redux/operations/chat/getRoomChats";
import { sendMessageOpAction } from "../../redux/operations/chat/sendMessage";
import { updateRoomReadCounterOpAction } from "../../redux/operations/chat/updateRoomReadCounter";
import RoomSelectors from "../../redux/rooms/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import useOrganizationReady from "../organization/useOrganizationReady";
import useChatRooms from "./useChatRooms";

export function useChatRoom(orgId: string, recipientId: string) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    chatRooms: sortedRooms,
    chatRoomsLoadState,
    user,
  } = useChatRooms({
    orgId,
  });
  const orgReadyState = useOrganizationReady();
  const appChatRoom = React.useMemo(() => {
    return sortedRooms.find((rm) => rm.recipient.customId === recipientId);
  }, [recipientId, sortedRooms]);
  const room = useSelector<IAppState, IRoom | undefined>((state) =>
    RoomSelectors.getRoomByRecipientId(state, recipientId)
  );
  const recipient = useSelector<IAppState, ICollaborator | undefined>((state) => {
    return UserSelectors.getOne(state, recipientId);
  });
  const chatsReadyState = useSelector<IAppState, ILoadingState | undefined>((state) => {
    return room
      ? KeyValueSelectors.getByKey(
          state,
          appLoadingKeys.getRoomChats(room.workspaceId, room.customId)
        )
      : undefined;
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
  const getRoomChatsFn = React.useCallback(() => {
    if (room && !chatsReadyState) {
      dispatch(
        getRoomChatsOpAction({
          roomId: room.customId,
          key: appLoadingKeys.getRoomChats(room.workspaceId, room.customId),
        })
      );
    }
  }, [dispatch, room, chatsReadyState]);

  const createRoomResult = useRequest(createRoom, { manual: true });

  // This is needful to prevent infite loop in the useEffect below.
  // When we dispatch the addRoom action, createRoomResult changes
  // but not the loading field, so causing an infinite loop.
  const creatingRoomRef = React.useRef(false);
  React.useEffect(() => {
    if (
      recipientId &&
      appChatRoom?.isTempRoom &&
      !creatingRoomRef.current &&
      !createRoomResult.error &&
      !room
    ) {
      creatingRoomRef.current = true;
      createRoomResult.run();
    }
  }, [createRoomResult, appChatRoom, room, recipientId]);
  React.useEffect(() => {
    getRoomChatsFn();
  }, [getRoomChatsFn]);

  const error = chatRoomsLoadState?.error || createRoomResult.error || orgReadyState.error;
  const loading =
    chatRoomsLoadState?.isLoading ||
    orgReadyState.isLoading ||
    !chatRoomsLoadState?.initialized ||
    createRoomResult.loading ||
    appChatRoom?.isTempRoom;

  return {
    room,
    error,
    loading,
    user,
    recipient,
    appChatRoom,
    onSendMessage,
    updateRoomReadCounter,
  };
}
