import { css } from "@emotion/css";
import { Badge, Typography } from "antd";
import React from "react";
import UserAvatar from "../collaborator/UserAvatar";
import { IAppChatRoom } from "./types";

export interface IRoomsListItemProps {
  room: IAppChatRoom;
}

const classes = {
  root: css({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    columnGap: "16px",
  }),
};

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
  const { room } = props;
  return (
    <div className={classes.root}>
      <UserAvatar user={room.recipient} />
      <Typography.Text ellipsis>{room.recipient.name}</Typography.Text>
      <div>
        {room.unseenChatsCount ? (
          <Badge
            count={room.unseenChatsCount}
            style={{ backgroundColor: "#1890ff" }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default RoomsListItem;
