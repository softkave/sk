import { Button, Typography } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { ICollaborator } from "../../models/collaborator/types";

export interface IChatRoomHeaderProps {
  recipient: ICollaborator;
  onBack: () => void;
}

const ChatRoomHeader: React.FC<IChatRoomHeaderProps> = (props) => {
  const { recipient, onBack } = props;
  return (
    <div
      style={{
        display: "flex",
        padding: "0 16px",
        borderBottom: "1px solid rgb(223, 234, 240)",
        height: "56px",
        alignItems: "center",
      }}
    >
      <div style={{ marginRight: "16px" }}>
        <Button
          style={{ cursor: "pointer" }}
          onClick={onBack}
          className="icon-btn"
        >
          <ArrowLeft />
        </Button>
      </div>
      <Typography.Title style={{ fontSize: "14px", margin: 0 }}>
        {recipient.name}
      </Typography.Title>
    </div>
  );
};

export default ChatRoomHeader;
