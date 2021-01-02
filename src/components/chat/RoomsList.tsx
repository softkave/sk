import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import Scrollbar from "../utilities/Scrollbar";
import RoomsListItem from "./RoomsListItem";

export interface IRoomsListProps {
    sortedRooms: IRoom[];
    recipientsMap: { [key: string]: IUser };
    onSelectRoom: (room: IRoom) => void;
    getRoomStyle: (room: IRoom, i: number) => React.CSSProperties;

    searchQuery?: string;
}

const RoomsList: React.FC<IRoomsListProps> = (props) => {
    const {
        sortedRooms,
        recipientsMap,
        searchQuery,
        onSelectRoom,
        getRoomStyle,
    } = props;

    if (sortedRooms.length === 0) {
        return <EmptyMessage>Empty!</EmptyMessage>;
    }

    const filterRooms = () => {
        if (!searchQuery) {
            return sortedRooms;
        }

        const lowerCasedSearchQuery = searchQuery.toLowerCase();

        return sortedRooms.filter((room) => {
            const recipient = recipientsMap[room.recipientId];
            return recipient.name.toLowerCase().includes(lowerCasedSearchQuery);
        });
    };

    const filteredRooms = filterRooms();

    if (filteredRooms.length === 0) {
        return <EmptyMessage>Chat not found</EmptyMessage>;
    }

    return (
        <Scrollbar>
            {filteredRooms.map((room, i) => {
                const recipient = recipientsMap[room.recipientId];

                return (
                    <StyledContainer
                        key={room.customId}
                        s={getRoomStyle(room, i)}
                        onClick={() => onSelectRoom(room)}
                    >
                        <RoomsListItem room={room} recipient={recipient} />
                    </StyledContainer>
                );
            })}
        </Scrollbar>
    );
};

export default RoomsList;
