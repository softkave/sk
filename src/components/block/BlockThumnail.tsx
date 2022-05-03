import { CommentOutlined } from "@ant-design/icons";
import { css, cx } from "@emotion/css";
import { Badge, Tag, Typography } from "antd";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";

export type BlockThumbnailShowField = "name" | "type" | "description";

export interface IBlockThumbnailProps {
  block: {
    color?: string;
    description?: string;
    type: BlockType;
    name: string;
  };
  showFields?: BlockThumbnailShowField[];
  className?: string;
  avatarSize?: IItemAvatarProps["size"];
  count?: number;
  isSelected?: boolean;
  unseenChatsCount?: number;
  parent?: IBlock;
  makeNameBold?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const defaultFields: BlockThumbnailShowField[] = ["name"];
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
    showFields,
    avatarSize,
    count,
    unseenChatsCount,
    parent,
    style,
    isSelected,
    makeNameBold,
    onClick,
  } = props;

  const color = block.color;
  const fieldsToShow: { [key in BlockThumbnailShowField]?: boolean } = (
    showFields || []
  ).reduce((accumulator, field) => {
    accumulator[field] = true;
    return accumulator;
  }, {} as { [key: string]: boolean });

  const renderName = () => {
    if (fieldsToShow.name) {
      return (
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
            strong={makeNameBold}
            style={{
              textTransform: "capitalize",
              maxWidth: "100%",
              color: isSelected ? "#1890ff" : undefined,
            }}
          >
            {block.name}
          </Typography.Text>
          {count ? (
            <Badge
              count={count}
              style={{ backgroundColor: "rgba(0,0,0,0.3)", marginLeft: "8px" }}
            />
          ) : null}
        </div>
      );
    }

    return null;
  };

  const renderType = () => {
    if (fieldsToShow.type && !parent) {
      return <div>{block.type}</div>;
    }

    return null;
  };

  const renderDesc = () => {
    if (fieldsToShow.description) {
      return (
        <div
          style={{
            marginTop: "4px",
          }}
        >
          <Typography.Paragraph
            type="secondary"
            ellipsis={{ rows: 2 }}
            style={{ marginBottom: "0px", fontSize: "13px" }}
          >
            {block.description}
          </Typography.Paragraph>
        </div>
      );
    }

    return null;
  };

  const renderUnseenChatsCount = () => {
    if (unseenChatsCount) {
      return (
        <div style={{ marginTop: "8px" }}>
          <Tag icon={<CommentOutlined />} color="blue">
            {unseenChatsCount}
          </Tag>
        </div>
      );
    }

    return null;
  };

  // TODO: do line clamping on the texts
  // TODO: I should be able to click on the thumbnail to select, not just the name
  return (
    <div
      style={{
        ...style,
        backgroundColor: isSelected ? "#e6f7ff" : undefined,
      }}
      className={cx(className, classes.root)}
      onClick={onClick}
    >
      <ItemAvatar size={avatarSize} color={color} />
      <div className={classes.main}>
        {renderName()}
        {renderType()}
        {renderDesc()}
        {renderUnseenChatsCount()}
      </div>
    </div>
  );
};

BlockThumbnail.defaultProps = {
  showFields: defaultFields,
  style: {},
};

export default BlockThumbnail;
