import { Avatar, Badge, Typography } from "antd";
import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";

export interface IRoomsListItemProps {
    room: IRoom;
    recipient: IUser;
}

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
    const { room, recipient } = props;

    const unseenChatsCount = room.unseenChatsStartIndex
        ? room.chats.length - room.unseenChatsStartIndex - 1
        : 0;

    return (
        <StyledContainer>
            <Avatar
                size="small"
                shape="square"
                style={{
                    backgroundColor: recipient.color,
                }}
            />
            <StyledContainer s={{ flex: 1, margin: "0 16px" }}>
                <Typography.Text strong ellipsis>
                    {recipient.name}
                </Typography.Text>
            </StyledContainer>
            <Badge count={unseenChatsCount} />
        </StyledContainer>
    );
};

export default RoomsListItem;
