import { css } from "@emotion/css";
import { Badge, Typography } from "antd";
import React from "react";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import UserAvatar from "../collaborator/UserAvatar";

export interface IRoomsListItemProps {
  room: IRoom;
  recipient: ICollaborator;
}

const classes = {
  root: css({ width: "100%", alignItems: "center" }),
  nameContainer: css({ flex: 1, margin: "0 16px" }),
};

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
  const { room, recipient } = props;
  return (
    <div className={classes.root}>
      <UserAvatar user={recipient} />
      <div className={classes.nameContainer}>
        <Typography.Text ellipsis>{recipient.name}</Typography.Text>
      </div>
      <Badge count={room.unseenChatsCount} style={{ boxShadow: "none" }} />
    </div>
  );
};

export default RoomsListItem;
