import { defaultTo } from "lodash";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IAppWorkspace } from "../../models/organization/types";
import { IUser } from "../../models/user/types";
import { ILoadingState, appLoadingKeys } from "../../redux/key-value/types";
import { getRoomsOpAction } from "../../redux/operations/chat/getRooms";
import OrganizationSelectors from "../../redux/organizations/selectors";
import RoomSelectors from "../../redux/rooms/selectors";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { useLoadingStateWithOp } from "../hooks/useLoadingState";
import { ICollaboratorChatRoom } from "./types";

export interface IUseChatRoomsHookResult {
  user: IUser;
  chatRooms: ICollaboratorChatRoom[];
  selectedRoomRecipientId: string | undefined;
  chatRoomsLoadState?: ILoadingState;
  onSelectRoom: (room: ICollaboratorChatRoom) => void;
}

export interface IUseChatRoomsHookProps {
  orgId: string;
}

const useChatRooms = (props: IUseChatRoomsHookProps): IUseChatRoomsHookResult => {
  const { orgId } = props;
  const history = useHistory();
  const chatRouteMatch = useRouteMatch<{ recipientId: string }>(
    "/app/orgs/:orgId/chat/:recipientId"
  );

  const getRoomsKey = appLoadingKeys.getRooms(orgId);
  const getRoomsInitFn = React.useCallback(
    (dispatch: AppDispatch) => {
      dispatch(getRoomsOpAction({ orgId, key: getRoomsKey }));
    },
    [orgId, getRoomsKey]
  );
  const getRoomsState = useLoadingStateWithOp({ key: getRoomsKey, initFn: getRoomsInitFn });
  const selectedRoomRecipientId = chatRouteMatch?.params.recipientId;
  const user = useSelector<IAppState, IUser>(SessionSelectors.assertGetUser);
  const rooms = useSelector<IAppState, IRoom[]>((state) => RoomSelectors.getOrgRooms(state, orgId));
  const org = useSelector<IAppState, IAppWorkspace>((state) =>
    OrganizationSelectors.assertGetOne(state, orgId)
  );

  const collaborators = useSelector<IAppState, ICollaborator[]>((state) =>
    UserSelectors.getMany(state, org.collaboratorIds || [])
  );

  const roomsMap = React.useMemo(() => {
    return rooms.reduce((map, room) => {
      map[room.recipientId] = room;
      return map;
    }, {} as { [key: string]: IRoom });
  }, [rooms]);

  const chatRooms = React.useMemo(() => {
    const chatRooms: ICollaboratorChatRoom[] = [];
    collaborators.forEach((collaborator) => {
      if (collaborator.customId === user.customId) {
        return;
      }

      const room = roomsMap[collaborator.customId];
      let appChatRoom: ICollaboratorChatRoom;

      if (room) {
        appChatRoom = {
          isTempRoom: false,
          orgId: room.workspaceId,
          recipient: collaborator,
          unseenChatsCount: room.unseenChatsCount,
          lastChatCreatedAt: moment(room.lastChatCreatedAt).valueOf(),
        };
      } else {
        appChatRoom = {
          orgId,
          recipient: collaborator,
          unseenChatsCount: 0,
          isTempRoom: true,
        };
      }

      chatRooms.push(appChatRoom);
    });

    chatRooms.sort((room1, room2) => {
      return defaultTo(room2.lastChatCreatedAt, 0) - defaultTo(room1.lastChatCreatedAt, 0);
    });

    return chatRooms;
  }, [orgId, roomsMap, collaborators, user.customId]);

  const onSelectRoom = React.useCallback(
    (room: ICollaboratorChatRoom) => {
      if (room.recipient.customId !== selectedRoomRecipientId) {
        const url = `/app/orgs/${room.orgId}/chat/${room.recipient.customId}`;
        history.push(url);
      }
    },
    [history, selectedRoomRecipientId]
  );

  return {
    user,
    selectedRoomRecipientId,
    onSelectRoom,
    chatRooms,
    chatRoomsLoadState: getRoomsState.loadingState,
  };
};

export default useChatRooms;
