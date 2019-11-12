import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { SizeMe } from "react-sizeme";
import { IBlock } from "../../models/block/block";
import ItemAvatar from "../ItemAvatar";

export interface IBlockThumbnailProps {
  block: IBlock;
  className?: string;
}

const BlockThumbnail: React.SFC<IBlockThumbnailProps> = props => {
  const { block, className } = props;
  const color = block.color;

  return (
    <StyledContainer className={className}>
      <StyledItemAvatarContainer>
        <ItemAvatar color={color} />
      </StyledItemAvatarContainer>
      <SizeMe>
        {({ size }) => (
          <StyledBlockDescriptionContainer>
            <StyledDescriptionItem
              style={{ width: getBlockDescriptionWidth(size.width) }}
            >
              <Typography.Text>{block.type}</Typography.Text>
            </StyledDescriptionItem>
            {block.name && (
              <StyledDescriptionItem
                style={{ width: getBlockDescriptionWidth(size.width) }}
              >
                <Typography.Text strong ellipsis>
                  {block.name}
                </Typography.Text>
              </StyledDescriptionItem>
            )}
            {block.description && (
              <StyledDescriptionItem
                style={{ width: getBlockDescriptionWidth(size.width) }}
              >
                <Typography.Text>{block.description}</Typography.Text>
              </StyledDescriptionItem>
            )}
          </StyledBlockDescriptionContainer>
        )}
      </SizeMe>
    </StyledContainer>
  );
};

export default BlockThumbnail;

function getBlockDescriptionWidth(width?: number | null) {
  if (width) {
    return width - blockDescriptionMarginWidth;
  }
}

const StyledContainer = styled.div({
  display: "flex"
});

const blockDescriptionMarginWidth = 16;

const StyledBlockDescriptionContainer = styled.div({
  flex: 1,
  marginLeft: blockDescriptionMarginWidth,
  flexDirection: "column",
  boxSizing: "border-box"
});

const StyledDescriptionItem = styled.div({
  lineHeight: "1.25em !important",
  display: "flex"
});

const StyledItemAvatarContainer = styled.div({
  lineHeight: "32px"
});
