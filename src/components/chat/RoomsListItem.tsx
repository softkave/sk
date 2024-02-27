import { css } from "@emotion/css";
import { Badge, Typography } from "antd";
import React from "react";
import { getUserFullName } from "../../models/user/utils";
import NamedAvatar from "../utils/NamedAvatar";
import { ICollaboratorChatRoom } from "./types";

export interface IRoomsListItemProps {
  room: ICollaboratorChatRoom;
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
      <NamedAvatar item={{ ...room.recipient, name: getUserFullName(room.recipient) }} />
      <Typography.Text ellipsis>{getUserFullName(room.recipient)}</Typography.Text>
      <div>
        {room.unseenChatsCount ? (
          <Badge count={room.unseenChatsCount} style={{ backgroundColor: "#1890ff" }} />
        ) : null}
      </div>
    </div>
  );
};

export default RoomsListItem;
