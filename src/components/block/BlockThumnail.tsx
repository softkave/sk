import { LineOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Badge } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import { IBlockExploreChildrenMenuProps } from "./BlockExploreChildrenMenu";

export type BlockThumbnailShowField = "name" | "type" | "description";

export interface IBlockThumbnailProps {
  block: IBlock;
  showExploreMenu?: boolean;
  showFields?: BlockThumbnailShowField[];
  className?: string;
  onClick?: () => void;
  onClickChildMenuItem?: IBlockExploreChildrenMenuProps["onClick"];
  avatarSize?: IItemAvatarProps["size"];
  count?: number;
}

const defaultFields: BlockThumbnailShowField[] = ["name", "type"];
// const hoverSelector = "&:hover";

const BlockThumbnail: React.SFC<IBlockThumbnailProps> = (props) => {
  const { block, className, onClick, showFields, avatarSize, count } = props;

  const color = block.color;
  const fieldsToShow: { [key in BlockThumbnailShowField]?: boolean } = (
    showFields || []
  ).reduce((accumulator, field) => {
    accumulator[field] = true;
    return accumulator;
  }, {});

  // TODO: do line clamping on the texts
  // TODO: I should be able to click on the thumbnail to select, not just the name
  return (
    <StyledContainer s={{ flex: 1 }} className={className}>
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
        {fieldsToShow.name && (
          <StyledContainer s={{ alignItems: "center" }}>
            <StyledContainer
              s={{ color: "rgba(0, 0, 0, 0.85)", marginRight: "8px" }}
            >
              {block.name}
            </StyledContainer>
            {count ? (
              <Badge
                count={count}
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              />
            ) : null}
          </StyledContainer>
        )}
        {fieldsToShow.type && (
          <StyledContainer>{getBlockTypeFullName(block.type)}</StyledContainer>
        )}
        {fieldsToShow.description && (
          <StyledContainer s={{ marginTop: "4px" }}>
            {block.description}
          </StyledContainer>
        )}
      </StyledContainer>
    </StyledContainer>
  );
};

BlockThumbnail.defaultProps = {
  showFields: defaultFields,
};

export default BlockThumbnail;

const blockDescriptionMarginWidth = 16;

const StyledBlockDescriptionContainer = styled.div({});
