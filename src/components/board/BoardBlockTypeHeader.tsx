import styled from "@emotion/styled";
import { Icon, Menu } from "antd";
import React from "react";
import { BlockType } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import { pluralize } from "../../utils/utils";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

const getHeaderTitle = (blockType: BlockType) =>
  pluralize(getBlockTypeFullName(blockType)).toUpperCase();

export interface IBoardBlockTypeHeaderProps {
  blockType: BlockType;
  onClickCreate: () => void;
  onNavigateBack?: (() => void) | null;
}

const BoardBlockTypeHeader: React.FC<IBoardBlockTypeHeaderProps> = props => {
  const { onNavigateBack, blockType, onClickCreate } = props;

  return (
    <StyledContainer
      s={{ width: "100%", alignItems: "center", marginBottom: "12px" }}
    >
      {onNavigateBack && (
        <StyledFlatButton
          style={{ paddingRight: "16px" }}
          onClick={onNavigateBack}
        >
          <Icon type="caret-left" theme="filled" />
        </StyledFlatButton>
      )}
      <StyledHeaderName>{getHeaderTitle(blockType)}</StyledHeaderName>
      <StyledFlatButton icon="plus" onClick={onClickCreate} />
    </StyledContainer>
  );
};

export default BoardBlockTypeHeader;

const StyledHeaderName = styled.h1({
  display: "flex",
  flex: 1,
  marginRight: "16px",
  fontSize: "24px",
  marginBottom: "0"
});
