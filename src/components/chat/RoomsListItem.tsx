import { Badge, Typography } from "antd";
import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";

export interface IRoomsListItemProps {
    room: IRoom;
    recipient: IUser;
    onSelectRoom: (room: IRoom) => void;

    selected?: boolean;
}

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
    const { room, recipient, selected, onSelectRoom } = props;

    const unseenChatsCount = room.unseenChatsStartIndex
        ? room.chats.length - room.unseenChatsStartIndex - 1
        : 0;

    return (
        <StyledContainer
            onClick={() => onSelectRoom(room)}
            s={{ cursor: selected ? "pointer" : undefined }}
        >
            <StyledContainer s={{ flex: 1, marginRight: "16px" }}>
                <Typography.Text strong>{recipient.name}</Typography.Text>
            </StyledContainer>
            <Badge count={unseenChatsCount} />
        </StyledContainer>
    );
};

export default RoomsListItem;
