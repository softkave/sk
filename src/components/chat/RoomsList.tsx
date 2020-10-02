import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import CustomScrollbar from "../utilities/DeviceScrollbar";
import RoomsListItem from "./RoomsListItem";

export interface IRoomsListProps {
    sortedRooms: IRoom[];
    recipientsMap: { [key: string]: IUser };
    onSelectRoom: (room: IRoom) => void;

    selectedRoomRecipientId?: string;
}

const RoomsList: React.FC<IRoomsListProps> = (props) => {
    const {
        sortedRooms,
        recipientsMap,
        selectedRoomRecipientId,
        onSelectRoom,
    } = props;

    return (
        <CustomScrollbar>
            {sortedRooms.map((room) => {
                const isSelected = room.recipientId === selectedRoomRecipientId;
                const recipient = recipientsMap[room.recipientId];

                return (
                    <RoomsListItem
                        key={room.customId}
                        room={room}
                        recipient={recipient}
                        selected={isSelected}
                        onSelectRoom={onSelectRoom}
                    />
                );
            })}
        </CustomScrollbar>
    );
};

export default RoomsList;
