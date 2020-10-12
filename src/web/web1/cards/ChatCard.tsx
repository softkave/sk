import { Typography } from "antd";
import React from "react";
import WebCard from "./WebCard";

const ChatCard: React.FC<{}> = () => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    <Typography.Text strong>Chat</Typography.Text>
                </Typography.Text>
            }
        ></WebCard>
    );
};

export default ChatCard;
