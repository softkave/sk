import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import ItemAvatar from "../ItemAvatar";

export type BlockThumbnailShowField = "name" | "type" | "description";

export interface IBlockThumbnailProps {
  block: IBlock;
  showFields?: BlockThumbnailShowField[];
  className?: string;
  onClick?: () => void;
}

const defaultFields: BlockThumbnailShowField[] = ["name", "type"];

const BlockThumbnail: React.SFC<IBlockThumbnailProps> = props => {
  const { block, className, onClick, showFields } = props;
  const color = block.color;

  const showField = (field: BlockThumbnailShowField) => {
    return (showFields || defaultFields).indexOf(field) !== -1 && block[field];
  };

  const renderBlockItem = (node: React.ReactNode, width?: number | null) => (
    <StyledDescriptionItem style={{ width: getBlockDescriptionWidth(width) }}>
      {node}
    </StyledDescriptionItem>
  );

  return (
    <StyledContainer className={className} onClick={onClick}>
      <StyledItemAvatarContainer>
        <ItemAvatar color={color} />
      </StyledItemAvatarContainer>
      <SizeMe>
        {({ size }) => (
          <StyledBlockDescriptionContainer>
            {showField("name") &&
              renderBlockItem(
                <Typography.Text strong ellipsis>
                  {block.name}
                </Typography.Text>,
                size.width
              )}
            {showField("type") &&
              renderBlockItem(
                <Typography.Text>
                  {getBlockTypeFullName(block.type)}
                </Typography.Text>,
                size.width
              )}
            {showField("description") &&
              renderBlockItem(
                <Typography.Text>{block.description}</Typography.Text>,
                size.width
              )}
          </StyledBlockDescriptionContainer>
        )}
      </SizeMe>
    </StyledContainer>
  );
};

BlockThumbnail.defaultProps = {
  showFields: defaultFields
};

export default BlockThumbnail;

function getBlockDescriptionWidth(width?: number | null) {
  if (width) {
    return width - blockDescriptionMarginWidth;
  }
}

const StyledContainer = styled.div({
  display: "flex",
  flex: 1
});

const blockDescriptionMarginWidth = 16;

const StyledBlockDescriptionContainer = styled.div({
  flex: 1,
  marginLeft: blockDescriptionMarginWidth,
  flexDirection: "column",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center"
});

const StyledDescriptionItem = styled.div({
  lineHeight: "1.25em !important",
  display: "flex",
  alignItems: "center"
});

const StyledItemAvatarContainer = styled.div({
  lineHeight: "32px"
});
