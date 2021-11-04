import { Button, Typography } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";

export interface IChatRoomHeaderProps {
    recipient: IUser;
    onBack: () => void;
}

const ChatRoomHeader: React.FC<IChatRoomHeaderProps> = (props) => {
    const { recipient, onBack } = props;

    return (
        <StyledContainer
            s={{
                padding: "0 16px",
                borderBottom: "1px solid rgb(223, 234, 240)",
                height: "56px",
                alignItems: "center",
            }}
        >
            <StyledContainer s={{ marginRight: "16px" }}>
                <Button
                    style={{ cursor: "pointer" }}
                    onClick={onBack}
                    className="icon-btn"
                >
                    <ArrowLeft />
                </Button>
            </StyledContainer>
            <Typography.Title style={{ fontSize: "14px", margin: 0 }}>
                {recipient.name}
            </Typography.Title>
        </StyledContainer>
    );
};

export default ChatRoomHeader;
