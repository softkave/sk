import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { IBlock } from "../../models/block/block";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import {
    ISendMessageAPIParameters,
    IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat/chat";
import BlockSelectors from "../../redux/blocks/selectors";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import { sendMessageOpAction } from "../../redux/operations/chat/sendMessage";
import { updateRoomReadCounterOpAction } from "../../redux/operations/chat/updateRoomReadCounter";
import RoomSelectors from "../../redux/rooms/selectors";
import SessionSelectors from "../../redux/session/selectors";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";

export interface IChatRoomsRenderProps {
    user: IUser;
    sortedRooms: IRoom[];
    recipientsMap: { [key: string]: IUser };
    selectedRoomRecipientId: string | undefined;
    isAppHidden: boolean;
    updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
    onSendMessage: (args: Required<ISendMessageAPIParameters>) => void;
    onSelectRoom: (room: IRoom) => void;
}

export interface IChatRoomsContainerProps {
    orgId: string;
    render: (args: IChatRoomsRenderProps) => React.ReactElement;
}

const ChatRoomsContainer: React.FC<IChatRoomsContainerProps> = (props) => {
    const { orgId, render } = props;

    const dispatch = useDispatch();
    const history = useHistory();

    const chatRouteMatch = useRouteMatch<{ recipientId: string }>(
        "/app/orgs/:orgId/chat/:recipientId"
    );

    const selectedRoomRecipientId = chatRouteMatch?.params.recipientId;

    const user = useSelector<IAppState, IUser>((state) =>
        SessionSelectors.assertGetUser(state)
    );

    const rooms = useSelector<IAppState, IRoom[]>((state) =>
        RoomSelectors.getOrgRooms(state, orgId)
    );

    const org = useSelector<IAppState, IBlock>((state) =>
        BlockSelectors.getBlock(state, orgId)
    );

    const collaborators = useSelector<IAppState, IUser[]>((state) =>
        UserSelectors.getUsers(state, org.collaborators!)
    );

    const isAppHidden = useSelector<IAppState, boolean>((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.IsAppHidden)
    );

    const recipientsMap = collaborators.reduce((map, collaborator) => {
        map[collaborator.customId] = collaborator;
        return map;
    }, {} as { [key: string]: IUser });

    // TODO: how can we presort or keep some parts of the result, and only
    // move the rooms when there's a new message ( sent or recived )?
    const sortedRooms = React.useMemo(() => {
        return rooms.sort((room1, room2) => {
            const room1ChatsCount = room1.chats.length;
            const room2ChatsCount = room2.chats.length;

            if (room1ChatsCount && room2ChatsCount === 0) {
                return -1;
            } else if (room2ChatsCount && room1ChatsCount === 0) {
                return 1;
            } else if (room1ChatsCount === 0 && room2ChatsCount === 0) {
                return 0;
            }

            // Sort by most recent chat timestamp
            const room1LatestChat = room1.chats[room1.chats.length - 1];
            const room2LatestChat = room2.chats[room2.chats.length - 1];

            // TODO: Should we save the createdAt data as numbers to bypass using moment
            // for quicker sorting
            const room1LatestChatCreatedAt = moment(room1LatestChat.createdAt);
            const room2LatestChatCreatedAt = moment(room2LatestChat.createdAt);

            if (room1LatestChatCreatedAt.isAfter(room2LatestChatCreatedAt)) {
                return -1;
            } else if (
                room1LatestChatCreatedAt.isBefore(room2LatestChatCreatedAt)
            ) {
                return 1;
            } else {
                return 0;
            }
        });
    }, [rooms]);

    const onSendMessage = React.useCallback(
        (args: Required<ISendMessageAPIParameters>) => {
            dispatch(sendMessageOpAction(args));
        },
        [dispatch]
    );

    const updateRoomReadCounter = React.useCallback(
        (args: IUpdateRoomReadCounterAPIParameters) => {
            dispatch(
                updateRoomReadCounterOpAction({
                    ...args,
                    deleteOpOnComplete: true,
                })
            );
        },
        [dispatch]
    );

    const onSelectRoom = React.useCallback(
        (room: IRoom) => {
            if (room.recipientId !== selectedRoomRecipientId) {
                const url = `/app/orgs/${room.orgId}/chat/${room.recipientId}`;
                history.push(url);
            }
        },
        [history, selectedRoomRecipientId]
    );

    return render({
        isAppHidden,
        sortedRooms,
        recipientsMap,
        selectedRoomRecipientId,
        onSendMessage,
        updateRoomReadCounter,
        onSelectRoom,
        user,
    });
};

export default ChatRoomsContainer;
