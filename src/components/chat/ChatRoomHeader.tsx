import { Typography } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";

export interface IChatRoomHeaderProps {
    recipient: IUser;
}

const ChatRoomHeader: React.FC<IChatRoomHeaderProps> = (props) => {
    const { recipient } = props;

    return (
        <Typography.Title style={{ fontSize: "14px" }}>
            {recipient.name}
        </Typography.Title>
    );
};

export default ChatRoomHeader;
