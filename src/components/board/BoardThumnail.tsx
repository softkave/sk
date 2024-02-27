import { Space, Typography } from "antd";
import React from "react";
import { IBoard } from "../../models/board/types";
import NamedAvatar from "../utils/NamedAvatar";
import ThumbnailContent, { IThumbnailContentProps } from "../utils/thumbnail/ThumbnailContent";

export interface IBoardThumbnailProps
  extends Pick<
    IThumbnailContentProps,
    | "menu"
    | "onSelect"
    | "style"
    | "className"
    | "withCheckbox"
    | "selected"
    | "selectable"
    | "onClick"
    | "disabled"
  > {
  board: IBoard;
}

const BoardThumbnail: React.FC<IBoardThumbnailProps> = (props) => {
  const { board } = props;
  return (
    <ThumbnailContent
      {...props}
      prefixNode={<NamedAvatar item={board} />}
      main={
        <Space direction="vertical">
          <Typography.Text ellipsis>{board.name}</Typography.Text>
        </Space>
      }
    />
  );
};

export default React.memo(BoardThumbnail);
