import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { IBoard } from "../../models/board/types";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";

export interface IBoardThumbnailProps {
  board: IBoard;
  className?: string;
  avatarSize?: IItemAvatarProps["size"];
  style?: React.CSSProperties;
  onClick?: () => void;
}

const descriptionMarginWidth = 16;
const classes = {
  nameContainer: css({ alignItems: "center" }),
  descriptionContainer: css({
    marginTop: "4px",
  }),
  root: css({ flex: 1 }),
  content: css({
    lineHeight: "16px",
    flex: 1,
    marginLeft: descriptionMarginWidth,
    flexDirection: "column",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  }),
};

const BoardThumbnail: React.FC<IBoardThumbnailProps> = (props) => {
  const { board, className, onClick, avatarSize, style } = props;
  const nameNode = (
    <div className={classes.nameContainer}>
      <Typography.Text
        strong
        style={{
          marginRight: "8px",
          textTransform: "capitalize",
        }}
        ellipsis
      >
        {board.name}
      </Typography.Text>
    </div>
  );

  const descriptionNode = (
    <div className={classes.descriptionContainer}>
      <Typography.Paragraph
        type="secondary"
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: "0px" }}
      >
        {board.description}
      </Typography.Paragraph>
    </div>
  );

  // TODO: do line clamping on the texts
  // TODO: I should be able to click on the thumbnail to select, not just the name
  return (
    <div
      style={style}
      className={cx(classes.root, className)}
      onClick={onClick}
    >
      <div>
        <ItemAvatar size={avatarSize} color={board.color} />
      </div>
      <div className={classes.content}>
        {nameNode}
        {descriptionNode}
      </div>
    </div>
  );
};

export default React.memo(BoardThumbnail);
