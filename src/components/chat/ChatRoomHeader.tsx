import { Typography } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";

export interface IChatRoomHeaderProps {
    recipient: IUser;
}

const ChatRoomHeader: React.FC<IChatRoomHeaderProps> = (props) => {
    const { recipient } = props;

    return (
        <StyledContainer
            s={{
                padding: "0 16px",
                borderBottom: "1px solid #d9d9d9",
                height: "56px",
                alignItems: "center",
            }}
        >
            <Typography.Title style={{ fontSize: "14px", margin: 0 }}>
                {recipient.name}
            </Typography.Title>
        </StyledContainer>
    );
};

export default ChatRoomHeader;
