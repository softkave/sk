import { SendOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Input } from "antd";
import React from "react";
import { chatConstants } from "../../models/chat/constants";

export interface IChatInputProps {
  onSendMessage: (message: string) => void;
}

const classes = {
  root: css({
    borderTop: "2px solid rgb(223, 234, 240)",
    padding: "4px 5px",
    display: "flex",
  }),
  input: css({
    display: "flex",
    flex: 1,
  }),
};

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
    <div className={classes.root}>
      <div className={classes.input}>
        <Input.TextArea
          // autoFocus
          bordered={false}
          value={message}
          autoSize={{ minRows: 1, maxRows: 3 }}
          maxLength={chatConstants.maxMessageLength}
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
    </div>
  );
};

export default ChatInput;
