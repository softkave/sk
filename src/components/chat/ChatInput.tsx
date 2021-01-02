import { SendOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Input } from "antd";
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
        <StyledContainer
            s={{ borderTop: "1px solid #d9d9d9", padding: "8px 5px" }}
        >
            <div
                className={css({
                    display: "flex",
                    flex: 1,
                })}
            >
                <Input.TextArea
                    bordered={false}
                    value={message}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    maxLength={300}
                    onPressEnter={(evt) => {
                        evt.preventDefault();
                        sendMessage();
                    }}
                    style={{ resize: "none" }}
                    placeholder="Write a message..."
                    onChange={(evt) => {
                        setMessage(evt.target.value);
                    }}
                />
            </div>
            <Button
                icon={<SendOutlined />}
                disabled={message.length === 0}
                onClick={sendMessage}
                style={{
                    border: "none",
                    backgroundColor: "inherit",
                    boxShadow: "none",
                    color: message.length > 0 ? "#1890ff" : undefined,
                }}
            ></Button>
        </StyledContainer>
    );
};

export default ChatInput;
