import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import BlockExploreChildrenMenu, {
  IBlockExploreChildrenMenuProps
} from "./BlockExploreChildrenMenu";

export type BlockThumbnailShowField = "name" | "type" | "description";

export interface IBlockThumbnailProps {
  block: IBlock;
  showExploreMenu?: boolean;
  showFields?: BlockThumbnailShowField[];
  className?: string;
  onClick?: () => void;
  onClickChildMenuItem?: IBlockExploreChildrenMenuProps["onClick"];
}

const defaultFields: BlockThumbnailShowField[] = ["name", "type"];
const hoverSelector = "&:hover";

const BlockThumbnail: React.SFC<IBlockThumbnailProps> = props => {
  const {
    block,
    className,
    onClick,
    showFields,
    showExploreMenu,
    onClickChildMenuItem
  } = props;

  const color = block.color;
  const fieldsToShow: { [key in BlockThumbnailShowField]?: boolean } = (
    showFields || []
  ).reduce((accumulator, field) => {
    accumulator[field] = true;
    return accumulator;
  }, {});

  // TODO: do line clamping on the texts
  return (
    <StyledContainer s={{ flex: 1 }} className={className}>
      <StyledItemAvatarContainer>
        <ItemAvatar color={color} />
      </StyledItemAvatarContainer>
      <StyledBlockDescriptionContainer style={{ lineHeight: "16px" }}>
        {fieldsToShow.name && (
          <StyledContainer
            s={{
              fontWeight: "bold",
              textDecoration: onClick ? "underline" : undefined,
              cursor: onClick ? "pointer" : undefined,
              [hoverSelector]: {
                color: "rgb(66,133,244)"
              }
            }}
            onClick={onClick}
          >
            {block.name}
          </StyledContainer>
        )}
        {fieldsToShow.type && (
          <StyledContainer>{getBlockTypeFullName(block.type)}</StyledContainer>
        )}
        {fieldsToShow.description && (
          <StyledContainer s={{ marginTop: "8px" }}>
            {block.description}
          </StyledContainer>
        )}
        {showExploreMenu && onClickChildMenuItem && (
          <BlockExploreChildrenMenu
            block={block}
            onClick={onClickChildMenuItem}
          />
        )}
      </StyledBlockDescriptionContainer>
    </StyledContainer>
  );
};

BlockThumbnail.defaultProps = {
  showFields: defaultFields
};

export default BlockThumbnail;

const blockDescriptionMarginWidth = 16;

const StyledBlockDescriptionContainer = styled.div({
  flex: 1,
  marginLeft: blockDescriptionMarginWidth,
  flexDirection: "column",
  boxSizing: "border-box",
  display: "flex"
});

const StyledItemAvatarContainer = styled.div({
  lineHeight: "32px"
});
