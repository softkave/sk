import { Typography } from "antd";
import React from "react";
import RoomsListItem, {
    IRoomsListItemProps,
} from "../../../components/chat/RoomsListItem";
import WebCard from "./WebCard";

const ChatCard: React.FC<IRoomsListItemProps> = (props) => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    <Typography.Text strong>Chat</Typography.Text>
                </Typography.Text>
            }
        >
            <RoomsListItem {...props} />
        </WebCard>
    );
};

export default ChatCard;
