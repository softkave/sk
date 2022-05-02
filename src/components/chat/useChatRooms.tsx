import { defaultTo } from "lodash";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IAppOrganization } from "../../models/organization/types";
import { IUser } from "../../models/user/user";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { ILoadingState, KeyValueKeys } from "../../redux/key-value/types";
import OrganizationSelectors from "../../redux/organizations/selectors";
import RoomSelectors from "../../redux/rooms/selectors";
import SessionSelectors from "../../redux/session/selectors";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { IAppChatRoom } from "./types";
import { useLoadChatRooms } from "./useLoadChatRooms";

export interface IUseChatRoomsHookResult {
  user: IUser;
  sortedRooms: IAppChatRoom[];
  selectedRoomRecipientId: string | undefined;
  isAppHidden: boolean;
  chatRoomsLoadState: ILoadingState;
  onSelectRoom: (room: IAppChatRoom) => void;
}

export interface IUseChatRoomsHookProps {
  orgId: string;
}

const useChatRooms = (
  props: IUseChatRoomsHookProps
): IUseChatRoomsHookResult => {
  const { orgId } = props;
  const history = useHistory();
  const chatRouteMatch = useRouteMatch<{ recipientId: string }>(
    "/app/orgs/:orgId/chat/:recipientId"
  );

  const loadState = useLoadChatRooms();
  const selectedRoomRecipientId = chatRouteMatch?.params.recipientId;
  const user = useSelector<IAppState, IUser>((state) =>
    SessionSelectors.assertGetUser(state)
  );

  const rooms = useSelector<IAppState, IRoom[]>((state) =>
    RoomSelectors.getOrgRooms(state, orgId)
  );

  const org = useSelector<IAppState, IAppOrganization>((state) =>
    OrganizationSelectors.assertGetOne(state, orgId)
  );

  const collaborators = useSelector<IAppState, ICollaborator[]>((state) =>
    UserSelectors.getMany(state, org.collaboratorIds || [])
  );

  const isAppHidden = useSelector<IAppState, boolean>((state) =>
    KeyValueSelectors.getKey(state, KeyValueKeys.IsAppHidden)
  );

  const roomsMap = React.useMemo(() => {
    return rooms.reduce((map, room) => {
      map[room.recipientId] = room;
      return map;
    }, {} as { [key: string]: IRoom });
  }, [rooms]);

  const appChatRooms = React.useMemo(() => {
    return collaborators
      .map((collaborator) => {
        const room = roomsMap[collaborator.customId];
        let appChatRoom: IAppChatRoom;

        if (room) {
          appChatRoom = {
            isTempRoom: false,
            orgId: room.orgId,
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

        return appChatRoom;
      })
      .sort((room1, room2) => {
        return (
          defaultTo(room2.lastChatCreatedAt, 0) -
          defaultTo(room1.lastChatCreatedAt, 0)
        );
      });
  }, [orgId, roomsMap, collaborators]);

  const onSelectRoom = React.useCallback(
    (room: IAppChatRoom) => {
      if (room.recipient.customId !== selectedRoomRecipientId) {
        const url = `/app/orgs/${room.orgId}/chat/${room.recipient.customId}`;
        history.push(url);
      }
    },
    [history, selectedRoomRecipientId]
  );

  return {
    isAppHidden,
    user,
    selectedRoomRecipientId,
    onSelectRoom,
    sortedRooms: appChatRooms,
    chatRoomsLoadState: loadState,
  };
};

export default useChatRooms;
