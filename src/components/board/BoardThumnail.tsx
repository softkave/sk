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
  isSelected?: boolean;
  onClick?: () => void;
}

const classes = {
  descriptionContainer: css({
    marginTop: "4px",
  }),
  root: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 16,
  }),
  content: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
  }),
};

const BoardThumbnail: React.FC<IBoardThumbnailProps> = (props) => {
  const { board, className, avatarSize, style, isSelected, onClick } = props;
  const nameNode = (
    <Typography.Text
      strong
      ellipsis
      style={{
        textTransform: "capitalize",
        color: isSelected ? "#1890ff" : undefined,
        maxWidth: "100%",
      }}
    >
      {board.name}
    </Typography.Text>
  );

  // const descriptionNode = (
  //   <div className={classes.descriptionContainer}>
  //     <Typography.Paragraph
  //       type="secondary"
  //       ellipsis={{ rows: 2 }}
  //       style={{ marginBottom: "0px", fontSize: "13px" }}
  //     >
  //       {board.description}
  //     </Typography.Paragraph>
  //   </div>
  // );

  // TODO: do line clamping on the texts
  // TODO: I should be able to click on the thumbnail to select, not just the name
  return (
    <div
      style={style}
      className={cx(
        classes.root,
        className,
        css({ backgroundColor: isSelected ? "#e6f7ff" : undefined })
      )}
      onClick={onClick}
    >
      <ItemAvatar size={avatarSize} color={board.color} />
      <div className={classes.content}>
        {nameNode}
        {/* {descriptionNode} */}
      </div>
    </div>
  );
};

export default React.memo(BoardThumbnail);
