import { css, cx } from "@emotion/css";
import React from "react";
import Message from "../Message";
import RoomsListItem from "./RoomsListItem";
import { IAppChatRoom } from "./types";

export interface IRoomsListProps {
  sortedRooms: IAppChatRoom[];
  onSelectRoom: (room: IAppChatRoom) => void;
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
  const { sortedRooms, searchQuery, selectedRoomRecipientId, onSelectRoom } =
    props;

  const filteredRooms = React.useMemo(() => {
    if (!searchQuery) {
      return sortedRooms;
    }

    const lowerCasedSearchQuery = searchQuery.toLowerCase();
    return sortedRooms.filter((room) => {
      return room.recipient.name.toLowerCase().includes(lowerCasedSearchQuery);
    });
  }, [sortedRooms, searchQuery]);

  if (sortedRooms.length === 0) {
    return <Message message="Empty." />;
  } else if (filteredRooms.length === 0) {
    return <Message message="Chat not found." />;
  }

  return (
    <div>
      {filteredRooms.map((room, i) => {
        return (
          <div
            key={room.recipient.customId}
            className={cx(classes.roomItem, {
              [classes.roomItemSelected]:
                room.recipient.customId === selectedRoomRecipientId,
            })}
            onClick={() => onSelectRoom(room)}
          >
            <RoomsListItem room={room} />
          </div>
        );
      })}
    </div>
  );
};

export default RoomsList;
