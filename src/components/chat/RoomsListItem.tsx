import { Badge, Typography } from "antd";
import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import UserAvatar from "../collaborator/UserAvatar";
import StyledContainer from "../styled/Container";

export interface IRoomsListItemProps {
    room: IRoom;
    recipient: IUser;
}

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
    const { room, recipient } = props;

    return (
        <StyledContainer s={{ width: "100%", alignItems: "center" }}>
            <UserAvatar user={recipient} />
            <StyledContainer s={{ flex: 1, margin: "0 16px" }}>
                <Typography.Text ellipsis>{recipient.name}</Typography.Text>
            </StyledContainer>
            <Badge
                count={room.unseenChatsCount}
                style={{ boxShadow: "none" }}
            />
        </StyledContainer>
    );
};

export default RoomsListItem;
