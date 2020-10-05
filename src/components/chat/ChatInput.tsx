import { Input } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";

export interface IChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<IChatInputProps> = (props) => {
    const { onSendMessage } = props;

    const [message, setMessage] = React.useState("");
    const sendMessage = () => {
        if (message) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <StyledContainer s={{ borderTop: "1px solid grey" }}>
            <Input.TextArea
                bordered={false}
                value={message}
                autoSize={{ minRows: 1, maxRows: 3 }}
                maxLength={300}
                onPressEnter={sendMessage}
            />
        </StyledContainer>
    );
};

export default ChatInput;
