import { CommentOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Badge, Typography } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";
import SkTag from "../utils/SkTag";

export interface IBlockThumbnailProps {
  block: {
    color?: string;
    description?: string;
    name: string;
  };
  showName?: boolean;
  showDescription?: boolean;
  className?: string;
  avatarSize?: IItemAvatarProps["size"];
  count?: number;
  isSelected?: boolean;
  unseenChatsCount?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const classes = {
  root: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 16,
  }),
  main: css({
    lineHeight: "16px",
    flex: 1,
    flexDirection: "column",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
  }),
};

const BlockThumbnail: React.FC<IBlockThumbnailProps> = (props) => {
  const {
    block,
    className,
    showDescription,
    showName,
    avatarSize,
    count,
    unseenChatsCount,
    style,
    isSelected,
    onClick,
  } = props;

  const color = block.color;
  const nameNode = showName && (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        overflow: "hidden",
        flex: 1,
      }}
    >
      <Typography.Text
        ellipsis
        style={{
          textTransform: "capitalize",
          maxWidth: "100%",
          color: isSelected ? "#1890ff" : undefined,
        }}
      >
        {block.name}
      </Typography.Text>
      {count ? (
        <Badge count={count} style={{ backgroundColor: "rgba(0,0,0,0.3)", marginLeft: "8px" }} />
      ) : null}
    </div>
  );

  const descriptionNode = showDescription && (
    <Typography.Paragraph
      type="secondary"
      ellipsis={{ rows: 2 }}
      style={{ marginBottom: "0px", fontSize: "13px", marginTop: "4px" }}
    >
      {block.description}
    </Typography.Paragraph>
  );

  const unseenChatsCountNode = unseenChatsCount ? (
    <SkTag icon={<CommentOutlined />} color="#096dd9" style={{ marginTop: "8px" }}>
      {unseenChatsCount}
    </SkTag>
  ) : null;

  // TODO: do line clamping on the texts
  // TODO: I should be able to click on the thumbnail to select, not just the name
  return (
    <div
      style={{
        ...defaultTo(style, {}),
        backgroundColor: isSelected ? "#e6f7ff" : undefined,
      }}
      className={cx(className, classes.root)}
      onClick={onClick}
    >
      <ItemAvatar size={avatarSize} color={color} />
      <div className={classes.main}>
        {nameNode}
        {descriptionNode}
        {unseenChatsCountNode}
      </div>
    </div>
  );
};

export default BlockThumbnail;
