import { css } from "@emotion/css";
import { Badge, Typography } from "antd";
import React from "react";
import UserAvatar from "../collaborator/UserAvatar";
import { IAppChatRoom } from "./types";

export interface IRoomsListItemProps {
  room: IAppChatRoom;
}

const classes = {
  root: css({ width: "100%", alignItems: "center", display: "flex" }),
  nameContainer: css({ flex: 1, margin: "0 16px" }),
};

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
  const { room } = props;
  return (
    <div className={classes.root}>
      <UserAvatar user={room.recipient} />
      <div className={classes.nameContainer}>
        <Typography.Text ellipsis>{room.recipient.name}</Typography.Text>
      </div>
      <Badge
        count={room.unseenChatsCount}
        color={"blue"}
        style={{ boxShadow: "none" }}
      />
    </div>
  );
};

export default RoomsListItem;
