import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRoom } from "../../models/chat/types";
import {
    ISendMessageAPIParameters,
    IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat";
import KeyValueActions from "../../redux/key-value/actions";
import KeyValueSelectors from "../../redux/key-value/selectors";
import {
    IUnseenChatsCountByOrg,
    KeyValueKeys,
} from "../../redux/key-value/types";
import { sendMessageOperationAction } from "../../redux/operations/chat/sendMessage";
import { updateRoomReadCounterOperationAction } from "../../redux/operations/chat/updateRoomReadCounter";
import RoomSelectors from "../../redux/rooms/selectors";
import { IAppState } from "../../redux/types";

export interface IChatRoomsContainerProps {
    orgId: string;
}

const ChatRoomsContainer: React.FC<IChatRoomsContainerProps> = (props) => {
    const { orgId } = props;
    const dispatch = useDispatch();

    const rooms = useSelector<IAppState, IRoom[]>((state) =>
        RoomSelectors.getOrgRooms(state, orgId)
    );
    const unseenChatsCountMapByOrg = useSelector<
        IAppState,
        IUnseenChatsCountByOrg
    >((state) =>
        KeyValueSelectors.getKey(state, KeyValueKeys.UnseenChatsCountByOrg)
    );

    // TODO: how can we presort or keep some parts of the result, and only
    // move the rooms when there's a new message ( sent or recived )?
    const sortedRooms = React.useMemo(() => {
        rooms.sort((room1, room2) => {
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
            dispatch(sendMessageOperationAction(args));
        },
        []
    );

    const updateUserReadCounter = React.useCallback(
        (args: IUpdateRoomReadCounterAPIParameters) => {
            dispatch(updateRoomReadCounterOperationAction(args));
        },
        []
    );

    React.useEffect(() => {
        const orgUnseenChatsCount = unseenChatsCountMapByOrg[orgId] || 0;

        if (orgUnseenChatsCount) {
            dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.UnseenChatsCountByOrg,
                    value: {
                        ...unseenChatsCountMapByOrg,
                        [orgId]: 0,
                    },
                })
            );
        }
    }, []);

    return null;
};

export default ChatRoomsContainer;
