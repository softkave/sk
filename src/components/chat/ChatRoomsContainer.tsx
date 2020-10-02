import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IChat, IRoom } from "../../models/chat/types";
import BlockSelectors from "../../redux/blocks/selectors";
import ChatSelectors, { IChatsByRooms } from "../../redux/chats/selectors";
import RoomSelectors from "../../redux/rooms/selectors";
import { IAppState } from "../../redux/types";

export interface IChatRoomsContainerProps {
    orgId: string;
}

const ChatRoomsContainer: React.FC<IChatRoomsContainerProps> = (props) => {
    const { orgId } = props;

    const rooms = useSelector<IAppState, IRoom[]>((state) =>
        RoomSelectors.getOrgRooms(state, orgId)
    );
    const roomIds = rooms.map((room) => room.customId);
    const chatsByRooms = useSelector<IAppState, IChatsByRooms>((state) =>
        ChatSelectors.getRoomsChats(state, roomIds)
    );

    Object.keys(chatsByRooms).forEach((roomId) => {
        chatsByRooms[roomId] = chatsByRooms[roomId].sort((chat1, chat2) => {
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
    });

    return null;
};

export default React.memo(ChatRoomsContainer);

/**
 * get rooms for every org
 * get messages sorted into rooms
 * sort the messages by date created
 * loop from the back and find the ones the user hasn't seen yet by room
 * update the room with the unseen start index, and count
 * sum up the count of the unseen messages by org for use for notification
 *
 * when the user opens the chats tab, set the org overall unseen messages count to 0
 *
 * when a new message comes in, increment the org overall unseen messages by 1
 */
