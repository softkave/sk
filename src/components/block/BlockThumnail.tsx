import { Badge, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";
import StyledContainer from "../styled/Container";

export type BlockThumbnailShowField = "name" | "type" | "description";

export interface IBlockThumbnailProps {
  block: IBlock;

  showFields?: BlockThumbnailShowField[];
  className?: string;
  avatarSize?: IItemAvatarProps["size"];
  count?: number;
  parent?: IBlock;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const defaultFields: BlockThumbnailShowField[] = ["name", "type"];
const blockDescriptionMarginWidth = 16;

const BlockThumbnail: React.SFC<IBlockThumbnailProps> = (props) => {
  const {
    block,
    className,
    onClick,
    showFields,
    avatarSize,
    count,
    parent,
    style,
  } = props;

  const color = block.color;
  const fieldsToShow: { [key in BlockThumbnailShowField]?: boolean } = (
    showFields || []
  ).reduce((accumulator, field) => {
    accumulator[field] = true;
    return accumulator;
  }, {});

  const renderParentInfo = () => {
    if (parent) {
      return (
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          <Typography.Text strong>{block.type}</Typography.Text> in{" "}
          <Typography.Text strong>{parent.name}</Typography.Text>
        </Typography.Paragraph>
      );
    }

    return null;
  };

  const renderName = () => {
    if (fieldsToShow.name) {
      return (
        <StyledContainer s={{ alignItems: "center" }}>
          <Typography.Text strong style={{ marginRight: "8px" }}>
            {block.name}
          </Typography.Text>
          {count ? (
            <Badge
              count={count}
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            />
          ) : null}
        </StyledContainer>
      );
    }

    return null;
  };

  const renderType = () => {
    if (fieldsToShow.type && !parent) {
      return (
        <StyledContainer>{getBlockTypeFullName(block.type)}</StyledContainer>
      );
    }

    return null;
  };

  const renderDesc = () => {
    if (fieldsToShow.description) {
      return (
        <StyledContainer s={{ marginTop: "4px" }}>
          {block.description}
        </StyledContainer>
      );
    }

    return null;
  };

  // TODO: do line clamping on the texts
  // TODO: I should be able to click on the thumbnail to select, not just the name
  return (
    <StyledContainer s={{ ...style, flex: 1 }} className={className}>
      <StyledContainer>
        <ItemAvatar size={avatarSize} color={color} />
      </StyledContainer>
      <StyledContainer
        s={{
          lineHeight: "16px",
          cursor: onClick ? "pointer" : undefined,
          flex: 1,
          marginLeft: blockDescriptionMarginWidth,
          flexDirection: "column",
          boxSizing: "border-box",
          display: "flex",
        }}
        onClick={onClick}
      >
        {renderName()}
        {renderType()}
        {renderDesc()}
        {renderParentInfo()}
      </StyledContainer>
    </StyledContainer>
  );
};

BlockThumbnail.defaultProps = {
  showFields: defaultFields,
  style: {},
};

export default BlockThumbnail;
