import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";

export interface IBlockThumbnailProps extends IItemAvatarProps {
  block: IBlock;
  className?: string;
}

const BlockThumbnail: React.SFC<IBlockThumbnailProps> = props => {
  const { block, className } = props;
  const color = props.color || block.color;

  return (
    <StyledContainer className={className}>
      <ItemAvatar {...props} color={color} />
      <StyledBlockDescription>
        {block.name && (
          <Typography.Text strong ellipsis>
            {block.name}
          </Typography.Text>
        )}
        {block.description && (
          <Typography.Text>{block.description}</Typography.Text>
        )}
        <Typography.Text>{block.type}</Typography.Text>
      </StyledBlockDescription>
    </StyledContainer>
  );
};

export default BlockThumbnail;

const StyledContainer = styled.div({
  display: "flex",
  flexDirection: "column"
});

const StyledBlockDescription = styled.div({
  flex: 1,
  marginLeft: 8
});
