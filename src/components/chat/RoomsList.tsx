import { css, cx } from "@emotion/css";
import React from "react";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import Message from "../Message";

import RoomsListItem from "./RoomsListItem";

export interface IRoomsListProps {
  sortedRooms: IRoom[];
  recipientsMap: { [key: string]: ICollaborator };
  onSelectRoom: (room: IRoom) => void;
  searchQuery?: string;
  selectedRoomRecipientId?: string;
}

const classes = {
  roomItem: css({
    cursor: "pointer",
    padding: "8px 16px",
  }),
  roomItemSelected: css({
    color: "#1890ff",
    backgroundColor: "#e6f7ff",

    "&:hover": {
      backgroundColor: "#e6f7ff",
    },

    "& .ant-typography": {
      color: "#1890ff",
    },
  }),
};

const RoomsList: React.FC<IRoomsListProps> = (props) => {
  const {
    sortedRooms,
    recipientsMap,
    searchQuery,
    selectedRoomRecipientId,
    onSelectRoom,
  } = props;

  if (sortedRooms.length === 0) {
    return <Message message="Empty." />;
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
    return <Message message="Chat not found." />;
  }

  return (
    <div>
      {filteredRooms.map((room, i) => {
        const recipient = recipientsMap[room.recipientId];
        return (
          <div
            key={room.customId}
            className={cx(classes.roomItem, {
              [classes.roomItemSelected]:
                room.recipientId === selectedRoomRecipientId,
            })}
            onClick={() => onSelectRoom(room)}
          >
            <RoomsListItem room={room} recipient={recipient} />
          </div>
        );
      })}
    </div>
  );
};

export default RoomsList;
