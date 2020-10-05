import { Avatar, Typography } from "antd";
import moment from "moment";
import React from "react";
import { IChat } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";

export interface IChatProps {
    chat: IChat;
    sender: IUser;
    hideAvatar?: boolean;
}

const Chat: React.FC<IChatProps> = (props) => {
    const { chat, sender, hideAvatar } = props;

    const createdAt = moment(chat.createdAt);

    return (
        <StyledContainer>
            <StyledContainer
                s={{
                    width: 24,
                }}
            >
                {!hideAvatar && (
                    <Avatar
                        size="small"
                        shape="square"
                        style={{
                            backgroundColor: sender.color,
                        }}
                    />
                )}
            </StyledContainer>
            <StyledContainer s={{ flex: 1, marginLeft: "16px" }}>
                <Typography.Paragraph>{chat.message}</Typography.Paragraph>
                {chat.sending ? (
                    <Typography.Text type="secondary">
                        Sending...
                    </Typography.Text>
                ) : chat.errorMessage ? (
                    <Typography.Text type="danger">
                        {chat.errorMessage}
                    </Typography.Text>
                ) : (
                    <Typography.Text type="secondary">
                        {createdAt.fromNow()}{" "}
                        {createdAt.format("h:mm A, ddd MMM D YYYY")}
                    </Typography.Text>
                )}
            </StyledContainer>
        </StyledContainer>
    );
};

export default React.memo(Chat);
