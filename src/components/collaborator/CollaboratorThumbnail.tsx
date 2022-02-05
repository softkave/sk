import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { ICollaborator } from "../../models/collaborator/types";
import UserAvatar from "./UserAvatar";

export interface ICollaboratorThumbnailProps {
  collaborator: ICollaborator;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const classes = {
  root: css({ width: "100%", display: "flex" }),
  content: css({
    flex: 1,
    marginLeft: 16,
    display: "flex",
    flexDirection: "column",
  }),
};

const CollaboratorThumbnail: React.FC<ICollaboratorThumbnailProps> = (
  props
) => {
  const { collaborator, style, onClick, className } = props;

  return (
    <div
      style={style}
      onClick={onClick}
      className={cx(className, classes.root)}
    >
      <UserAvatar user={collaborator} />
      <div className={classes.content}>
        <Typography.Text ellipsis>{collaborator.name}</Typography.Text>
        <Typography.Text ellipsis type="secondary">
          {collaborator.email}
        </Typography.Text>
      </div>
    </div>
  );
};

export default CollaboratorThumbnail;
